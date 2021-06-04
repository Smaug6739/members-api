import { sign } from 'jsonwebtoken';

import db from '../../../models/db';
import { IObject } from '../../../types';
const Authentication = class {
	private config;
	constructor(server: any) {
		this.config = server.config
	}
	logUser(userInfos: IObject) {
		return new Promise((resolve, reject) => {
			if (!userInfos.userId) return reject(new Error('Missing user id'));
			if (!userInfos || userInfos && userInfos.username) return reject(new Error('Missing username.'))
			if (!userInfos || userInfos && userInfos.password) return reject(new Error('Missing password.'))
			db.query('SELECT * FROM members_auth WHERE member_auth_id = ? LIMIT 1', [userInfos.userId], (err, result) => {
				if (err) return reject(err)
				if (!result || !result[0] || result[0] && !result[0].member_auth_refresh_token) {
					const accessToken = this.generateToken('access', {

					})
				}
			})
		})
	}
	generateToken(type: string, data: IObject) {
		let tokenTime = 0;
		if (type === 'access') tokenTime = this.config.tokens.access
		if (type === 'refresh') tokenTime = this.config.tokens.refresh
		const token = sign({
			expiresIn: tokenTime,
			...data,
		}, this.config.tokens.secret)
		return token;
	}
}