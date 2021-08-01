import { Members } from '../../assets/classes/v2/members';
import { IObject, IMember, IUserInfos } from '../../types';
import { checkAndChange, success, error } from '../../utils/functions';

import type { Response } from 'express';
const MembersClass = new Members();



export function getMembers(req: IObject, res: IObject): void {
	const userInfos: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || [{ value: 0, permission: 'NONE' }]
	}
	MembersClass.getAll(userInfos, req.params.page)
		.then(result => res.status(200).json(checkAndChange(result)))
		.catch(error => res.json(checkAndChange(error)))
}
export function getUser(req: any, res: Response): void {
	const userId = req.params.userId as string;
	if (userId) {
		const requestorUser: IUserInfos = {
			id: req.user.id,
			permissions: req.user.permissions || null
		}
		Members.getUserById(requestorUser, userId)
			.then(result => success(res, result))
			.catch(err => error(res, err))
	}
}
export function getUsers(req: any, res: Response): void {
	const requestorUser: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || null
	}
	MembersClass.getUsers(requestorUser, {
		limit: req.query.limit,
		maxPerPage: req.query.maxPerPage,
		page: req.query.page,
	})

}
export function createMember(req: IObject, res: IObject): void {
	MembersClass.add(
		req.body.username,
		0,
		0,
		req.body.avatar,
		req.body.password,
		req.body.first_name,
		req.body.last_name,
		req.body.age,
		req.body.phone_number,
		req.body.email,
		Date.now()
	)
		.then(result => res.status(201).json(checkAndChange(result)))
		.catch(error => res.json(checkAndChange(error)))
}

export function updateMember(req: IObject, res: IObject): void {
	const newSettings: IMember = {
		id: req.body.user_id,
		nickname: req.body.nickname,
		permissions: req.body.permissions,
		banishment: req.body.banishment,
		avatar: req.body.avatar,
		password: req.body.password,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		age: req.body.age,
		phone_number: req.body.phone_number,
		email: req.body.email
	}
	const userInfos: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || [{ value: 0, permission: 'NONE' }]
	}
	MembersClass.put(userInfos, req.params.userId, newSettings)
		.then(result => res.status(200).json(checkAndChange(result)))
		.catch(error => res.json(checkAndChange(error)))
}

export function deleteMember(req: IObject, res: IObject): void {
	const userInfos: IUserInfos = {
		id: req.user.id,
		permissions: req.user.permissions || [{ value: 0, permission: 'NONE' }]
	}
	MembersClass.delete(userInfos, req.params.userId)
		.then(result => res.status(200).json(checkAndChange(result)))
		.catch(error => res.json(checkAndChange(error)))
}