import { Authentication } from '../../assets/classes/v2/auth';
import { checkAndChange, error, success } from '../../utils/functions';
import { config } from '../../config';
import type { Request, Response } from 'express'
import type { IResponceSuccess, IUserInfos } from '../../types';
const Auth = new Authentication(config);

export function auth(req: Request, res: Response): void {
	Auth.logUser({
		userId: req.params.userId,
		username: req.body.username,
		password: req.body.password
	})
		.then((r: IResponceSuccess) => success(res, r))
		.catch(e => error(res, e));
}
export function refreshToken(req: any, res: Response) {
	const token = req.body.refreshToken || req.query.refreshToken
	const requestorUser: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || null
	}
	Auth.refreshToken(requestorUser, token)
		.then(r => res.status(200).json(checkAndChange(r)))
		.catch(e => error(res, e))
}
export function updateAuth(req: any, res: Response) {
	const target = req.params.userId;
	const requestorUser: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || null
	}
	const changes = {
		changeRefreshToken: req.body.changeToken
	}
	Auth.updateAuth(requestorUser, target, changes)
}