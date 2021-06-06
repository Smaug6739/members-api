import db from './db';

export function query(req: string, params?: Array<string | number>): Promise<any> {
	return new Promise((resolve, reject) => {
		db.query(req, params, (err, result) => {
			if (err) return reject({ httpCode: 500, message: 'Internal error with database.' });
			resolve(result)
		})
	})
}