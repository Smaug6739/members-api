import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt'

import db from '../../../models/db';
import { query } from '../../../models/functions';
import { IObject } from '../../../types';
import { Members } from './members';
export const Authentication = class extends Members {
	private config;
	constructor(config: any) {
		super()
		this.config = config
	}
	async logUser(userInfos: IObject) {
		return new Promise((resolve, reject) => {
			console.log(userInfos);

			if (!userInfos.userId) return reject({ httpCode: 400, message: 'Missing user id' });
			if (!userInfos || userInfos && !userInfos.username) return reject({ httpCode: 400, message: 'Missing username.' });
			if (!userInfos || userInfos && !userInfos.password) return reject({ httpCode: 400, message: 'Missing password.' });
			(async () => {
				try {
					const member: any = await this.getMemberInternal(userInfos.userId)

					const compared = await compare(userInfos.password, member[0].member_password);
					if (!compared) return reject({ httpCode: 406, message: 'Invalid password.' })
					const userAuth = await query('SELECT * FROM members_auth WHERE member_auth_id = ? LIMIT 1', [userInfos.userId])
					if (!userAuth || !userAuth[0]) {
						// User not existing
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						const refreshToken = this.generateToken('refresh')
						await query('INSERT INTO members_auth (`member_auth_id`, `member_auth_refresh_token`, `member_auth_expire_token`, `member_auth_login_time`, `member_auth_logout_time`, `member_auth_security`) VALUES (?,?,?,?,?,?)', [member[0].member_id, refreshToken.token, refreshToken.expiresAt, Date.now(), 0, 1])
						return resolve({
							auth: true,
							tokens: {
								access: accessToken.token,
								refresh: refreshToken.token
							}
						})

					} else if (userAuth[0].member_auth_expire_token < Date.now()) {
						// Refresh token was expired.
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						const refreshToken = this.generateToken('refresh')
						await query('UPDATE members_auth SET member_auth_refresh_token = ?, member_auth_expire_token = ?, member_auth_login_time = ?', [refreshToken.token, refreshToken.expiresAt, Date.now()])
						resolve({
							auth: true,
							tokens: {
								access: accessToken.token,
								refresh: refreshToken.token
							}
						})
					} else {
						// Create new access token.
						const accessToken = this.generateToken('access', {
							userId: userInfos.userId,
							userPermissions: member[0].member_permissions
						})
						resolve({
							auth: true,
							tokens: {
								access: accessToken.token,
								refresh: userAuth[0].member_auth_refresh_token,
							}
						})
					}
				} catch (e) {
					reject({
						httpCode: e.httpCode ? e.httpCode : 500,
						message: e.message ? e.message : 'An error occurred.'
					});
				}
			})()
		})
	}
	refreshToken(userId: string | number, refreshToken: string) {
		return new Promise((resolve, reject) => {
			if (!userId) return reject({ httpCode: 400, message: 'Missing user id.' })
			if (!refreshToken) return reject({ httpCode: 400, message: 'Missing refresh token.' })
			db.query('SELECT * FROM members_auth WHERE member_auth_id = ?', [userId], (err, result) => {
				if (err) return reject(err)
				if (!result || result && !result[0]) return reject({ httpCode: 406, message: 'User not auth.' })
				if (result[0].member_auth_expire_token < Date.now()) return reject({ httpCode: 406, message: 'The session has expired.' })
				if (result[0].member_auth_refresh_token !== refreshToken) return reject({ httpCode: 406, message: 'Invalid refresh token.' });
				(async () => {
					try {
						const member: any = await this.getUser(userId);
						const accessToken = this.generateToken('access', {
							userId: userId,
							userPermissions: member.member_permissions
						})
						resolve({
							auth: true,
							tokens: {
								access: accessToken.token,
							}
						})
					} catch (e) {
						reject({
							httpCode: e.httpCode ? e.httpCode : 500,
							message: e.message ? e.message : 'An error occurred.'
						})
					}
				})()
			})
		})
	}
	generateToken(type: string, data?: IObject) {
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
}