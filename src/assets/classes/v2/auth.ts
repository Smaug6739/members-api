import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt'

import db from '../../../database/db';
import { query } from '../../../database/functions';
import { hasPermissions } from '../../../permissions/functions';
import { IObject, IResponceSuccess, IResponceError, IUserInfos } from '../../../types';
import { InternalError, InvalidError, MissingError, PermissionsError, RequestError } from '../../../errors/index';
import { Members } from './members';
export const Authentication = class {
	private config;
	constructor(config: any) {
		this.config = config
	}
	private generateToken(type: string, data?: IObject) {
		let tokenTime = 0;
		if (type === 'access') tokenTime = this.config.tokens.access
		if (type === 'refresh') tokenTime = this.config.tokens.refresh
		const token = sign({
			expiresIn: tokenTime,
			...data,
		}, this.config.tokens.secret)
		return {
			token: token,
			expiresIn: tokenTime,
			expiresAt: Date.now() + tokenTime * 1000
		};
	}
	async logUser(userInfos: IObject): Promise<IResponceSuccess | IResponceError> {
		return new Promise((resolve, reject) => {
			if (!userInfos.userId) return reject(new MissingError([{ name: 'userId', type: 'parameter' }]));
			if (!userInfos || userInfos && !userInfos.username) return reject(new MissingError([{ name: 'username', type: 'parameter' }]));
			if (!userInfos || userInfos && !userInfos.password) return reject(new MissingError([{ name: 'password', type: 'parameter' }]));
			(async () => {
				try {
					const member: any = await Members.getMemberInternal(userInfos.userId)
					const compared = await compare(userInfos.password, member[0].member_password);
					if (!compared) return reject({ httpCode: 406, message: 'Invalid password.' })
					const userAuth = await query('SELECT * FROM members_auth WHERE member_auth_id = ? LIMIT 1', [userInfos.userId])
					if (!userAuth || !userAuth[0]) {
						// User not existing
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						const refreshToken = this.generateToken('refresh');
						const logTime = Date.now()
						await query('INSERT INTO members_auth (`member_auth_id`, `member_auth_refresh_token`, `member_auth_expire_token`, `member_auth_login_time`, `member_auth_logout_time`, `member_auth_security`) VALUES (?,?,?,?,?,?)', [member[0].member_id, refreshToken.token, refreshToken.expiresAt, logTime, 0, 1])
						return resolve({
							cookies: [
								{
									maxAge: accessToken.expiresIn * 1000,
									httpOnly: true,
									domain: this.config.domain,
									name: 'accessToken',
									value: accessToken.token
								},
								{
									maxAge: refreshToken.expiresIn * 1000,
									httpOnly: true,
									domain: this.config.domain,
									name: 'refreshToken',
									value: refreshToken.token
								}
							],
							result: {
								auth: true,
								tokens: {
									access: accessToken.token,
									refresh: refreshToken.token
								},
								refresh_token_expires: refreshToken.expiresAt,
								login_time: logTime
							}
						})

					} else if (userAuth[0].member_auth_expire_token < Date.now()) {
						// Refresh token was expired.
						console.log('Refresh token was expired.');
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						const refreshToken = this.generateToken('refresh')
						await query('UPDATE members_auth SET member_auth_refresh_token = ?, member_auth_expire_token = ?, member_auth_login_time = ?', [refreshToken.token, refreshToken.expiresAt, Date.now()])
						resolve({
							cookies: [
								{
									maxAge: accessToken.expiresIn * 1000,
									httpOnly: true,
									domain: this.config.domain,
									name: 'accessToken',
									value: accessToken.token
								},
								{
									maxAge: refreshToken.expiresIn * 1000,
									httpOnly: true,
									domain: this.config.domain,
									name: 'refreshToken',
									value: refreshToken.token
								}
							],
							result: {
								auth: true,
								tokens: {
									access: accessToken.token,
									refresh: refreshToken.token
								},
								refresh_token_expires: refreshToken.expiresAt,
								login_time: userAuth[0].member_auth_login_time
							}
						})
					} else {
						// Create new access token.
						console.log('Create new access token');
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						resolve({
							cookies: [
								{
									maxAge: accessToken.expiresIn * 1000,
									httpOnly: true,
									domain: this.config.domain,
									name: 'accessToken',
									value: accessToken.token
								},
								{
									maxAge: ((userAuth[0].member_auth_expire_token - Date.now())), // MS
									httpOnly: true,
									domain: this.config.domain,
									name: 'refreshToken',
									value: userAuth[0].member_auth_refresh_token
								}
							],
							result: {
								auth: true,
								tokens: {
									access: accessToken.token,
									refresh: userAuth[0].member_auth_refresh_token,
								},
								refresh_token_expires: userAuth[0].member_auth_expire_token,
								login_time: userAuth[0].member_auth_login_time
							}
						})
					}
				} catch (e: any) {
					reject(new InternalError());
				}
			})()
		})
	}
	refreshToken(requestorUser: IUserInfos, refreshToken: string) {
		return new Promise((resolve, reject) => {
			if (!requestorUser.id) return reject({ httpCode: 400, message: 'Missing user id.' })
			if (!refreshToken) return reject({ httpCode: 400, message: 'Missing refresh token.' })
			db.query('SELECT * FROM members_auth WHERE member_auth_id = ?', [requestorUser.id], (err, result) => {
				if (err) return reject(err)
				if (!result || result && !result[0]) return reject(new InvalidError(['User not auth.']))
				if (result[0].member_auth_expire_token < Date.now()) return reject(new RequestError(401, 'The session has expired.'))
				if (result[0].member_auth_refresh_token !== refreshToken) return reject(new RequestError(406, 'Invalid refresh token.'));
				(async () => {
					try {
						const member: any = await Members.getUserById(requestorUser, requestorUser.id);
						const accessToken = this.generateToken('access', {
							userId: requestorUser.id,
							userPermissions: member.member_permissions
						})
						resolve({
							auth: true,
							tokens: {
								access: accessToken.token,
							}
						})
					} catch (e: any) {
						reject(new InternalError())
					}
				})()
			})
		})
	}
	updateAuth(requestorUser: IUserInfos, target: string, changes: any): Promise<void | InternalError> {
		return new Promise(async (resolve, reject) => {
			if (requestorUser.id != target && !hasPermissions(requestorUser.permissions, ['MANAGE_AUTHS'])) return reject(new PermissionsError(['MANAGE_AUTHS']));
			if (changes.changeRefreshToken) {
				try {
					await query('UPDATE FROM member_auth SET member_auth_refresh_token = ? WHERE member_auth_id = ? LIMIT 1', ['', target]);
				} catch {
					return reject(new InternalError())
				}
			}
			resolve()
		})
	}
}