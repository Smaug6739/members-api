import { Request, Response } from 'express'
import { Authentication } from '../../assets/classes/v2/auth';
import { checkAndChange, error } from '../../utils/functions';
import { config } from '../../config';
const Auth = new Authentication(config);

export function auth(req: Request, res: Response): void {
	Auth.logUser({
		userId: req.params.userId,
		username: req.body.username,
		password: req.body.password
	})
		.then(result => res.status(200).json(checkAndChange(result)))
		.catch(error => res.json(checkAndChange(error)))
}
export function refreshToken(req: Request, res: Response) {
	const token = req.body.refreshToken || req.query.refreshToken
	Auth.refreshToken(req.params.userId, token)
		.then(r => res.status(200).json(checkAndChange(r)))
		.catch(e => error(res, e))
}