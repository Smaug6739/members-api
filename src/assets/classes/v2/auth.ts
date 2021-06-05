import { sign } from 'jsonwebtoken';

import db from '../../../models/db';
import { IObject } from '../../../types';
import { Member } from './members';
export const Authentication = class extends Member {
	private config;
	constructor(config: any) {
		super()
		this.config = config
	}
	async logUser(userInfos: IObject) {
		return new Promise((resolve, reject) => {
			if (!userInfos.userId) return reject(new Error('Missing user id'));
			if (!userInfos || userInfos && !userInfos.username) return reject(new Error('Missing username.'))
			if (!userInfos || userInfos && !userInfos.password) return reject(new Error('Missing password.'))
			db.query('SELECT * FROM members_auth WHERE member_auth_id = ? LIMIT 1', [userInfos.userId], (err, result) => {
				if (err) return reject(err)
				if (!result || !result[0]) {
					// User not existing
					(async () => {
						try {
							const member: any = await this.getUser(userInfos.userId)

							const accessToken = this.generateToken('access', {
								userId: userInfos.userId,
								userPermissions: member.member_permissions
							})
							const refreshToken = this.generateToken('refresh')
							db.query('INSERT INTO members_auth (`member_auth_id`, `member_auth_refresh_token`, `member_auth_expire_token`, `member_auth_login_time`, `member_auth_logout_time`, `member_auth_security`) VALUES (?,?,?,?,?,?)',
								[member.member_id, refreshToken.token, refreshToken.expiresAt, Date.now(), 0, 1], (err, result) => {
									if (err) return reject(err)
									return resolve({
										auth: true,
										tokens: {
											access: accessToken.token,
											refresh: refreshToken.token
										}
									})
								})
						} catch (e) {
							if (e) reject(e)
						}
					})()
				} else if (result[0].member_auth_expire_token < Date.now()) {
					// Refresh token was expired.
					console.log('in expired');

					(async () => {
						try {
							const member: any = await this.getUser(userInfos.userId);

							const accessToken = this.generateToken('access', {
								userId: userInfos.userId,
								userPermissions: member.member_permissions
							})
							const refreshToken = this.generateToken('refresh')
							db.query('UPDATE members_auth SET member_auth_refresh_token = ?, member_auth_expire_token = ?, member_auth_login_time = ?',
								[refreshToken.token, refreshToken.expiresAt, Date.now()], (err, result) => {
									if (err) return reject(err.message);
									resolve({
										auth: true,
										tokens: {
											access: accessToken.token,
											refresh: refreshToken.token
										}
									})
								})
						} catch (e) {
							if (e) reject(e)
						}
					})()
				}
			})
		})
	}
	refreshToken(userId: string | number, refreshToken: string) {
		return new Promise((resolve, reject) => {
			if (!userId) return reject(new Error('Missing user id.'))
			if (!refreshToken) return reject(new Error('Missing refresh token.'))
			db.query('SELECT * FROM members_auth WHERE member_auth_id = ?', [userId], (err, result) => {
				if (err) return reject(err)
				if (!result || result && !result[0]) return reject(new Error('User not auth'))
				if (result[0].member_auth_expire_token < Date.now()) return reject(new Error('Session expired.'))
				if (result[0].member_auth_refresh_token !== refreshToken) return reject(new Error('Invalid refresh token.'));
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
							message: e.errorMessage ? e.errorMessage : 'An error occurred.'
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
			expiresAt: Date.now() + tokenTime
		};
	}
}