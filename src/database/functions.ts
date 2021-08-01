import db from './db';
import { InternalError } from '../errors/index';
export function query(req: string, params?: Array<string | number>): Promise<any> {
	return new Promise((resolve, reject) => {
		db.query(req, params, (err, result) => {
			if (err) return reject(new InternalError());
			resolve(result)
		})
	})
}