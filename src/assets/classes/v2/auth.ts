import db from '../../../models/db';
import { IObject } from '../../../types';
const Authentication = class {
	private config;
	constructor(server: any) {
		this.config = server.config
	}
	logUser(userId: string, infos: IObject) {
		return new Promise((resolve, reject) => {
			if (!userId) return reject(new Error('Missing user id'));
			if (!infos || infos && infos.username) return reject(new Error('Missing username.'))
			if (!infos || infos && infos.password) return reject(new Error('Missing password.'))
			db.query('')
		})
	}

}