import { hash } from "bcrypt";

import db from '../../../database/db';
import { query } from '../../../database/functions';
import { hasPermissions } from '../../../permissions/functions';
import { PermissionsError, MissingError, DataTypeError, InternalError } from '../../../errors/index';

import type { IMember, IObject, IUserInfos } from '../../../types';
import type { IMetaGetUsers } from '../../../typescript/interfaces';

export class Members {

	public static getUserById(requestorUser: IUserInfos, requestedUser: string): Promise<IObject> {
		return new Promise((resolve, reject) => {
			if (requestorUser.id != requestedUser && !hasPermissions(requestorUser.permissions, ['VIEW_MEMBERS'])) return reject(new PermissionsError(['VIEW_MEMBERS']))
			db.query('SELECT * FROM members WHERE id = ? LIMIT 1', [requestedUser], (err, result) => {
				if (err) return reject({
					httpCode: 500,
					message: 'Database error'
				})
				resolve(result[0])
			})
		})
	}
	public getUsers(requestorUser: IUserInfos, meta: IMetaGetUsers) {
		return new Promise(async (resolve, reject) => {
			if (!hasPermissions(requestorUser.permissions, ['VIEW_MEMBERS'])) return reject(new PermissionsError(['VIEW_MEMBERS']))
			if (!meta.page) meta.page = '1';
			if (!meta.maxPerPage) meta.maxPerPage = meta.limit || '50';
			const maxPerPage = parseInt(meta.maxPerPage);
			const page = parseInt(meta.page);
			if (isNaN(maxPerPage)) return reject(new DataTypeError([{ name: meta.maxPerPage, expected: 'number' }]));
			if (isNaN(page)) return reject(new DataTypeError([{ name: meta.page, expected: 'number' }]));
			const skip = (parseInt(meta.page) * parseInt(meta.maxPerPage)) - parseInt(meta.maxPerPage);
			const result = await query('SELECT member_id, member_username, member_permissions, member_banishement, member_avatar, member_first_name, member_last_name, member_age, member_phone_number, member_email, memner_date_insert LIMIT ? OFFSET ?', [maxPerPage, skip]);
			if (result instanceof InternalError) return reject(new InternalError());
			return resolve(result)
		})
	}
	public static async getMemberInternal(userId: string) {
		return await query('SELECT * FROM members WHERE member_id = ?', [userId])
	}
	public getAll(user: IUserInfos, page: (string)): Promise<IObject> {
		return new Promise((resolve, reject) => {
			const offset = (parseInt(page) * 20) - 20
			if (!user || !user.id) return reject(new Error('Missing user header.'))
			if (!hasPermissions(user.permissions, ['VIEW_MEMBERS'])) return reject(new Error('Bad permissions.'))
			db.query('SELECT * FROM members LIMIT 20 OFFSET ?', [offset], (err, result) => {
				if (err) return reject(new Error(err.message))
				resolve(result)
			})
		})
	}

	public add(
		nickname: string,
		permissions: number = 0,
		banishment: number = 0,
		avatar: string = '',
		password: string,
		first_name: string = '',
		last_name: string = '',
		age: string,
		phone_number: string = '',
		email: string = '',
		dateInsert: number
	): Promise<IObject | Error> {
		return new Promise<IObject | Error>((resolve, reject) => {
			if (!nickname || nickname && nickname.trim() === '') return reject(new Error("Missing nickaname param."))
			if (!permissions && permissions != 0) return reject(new Error("Missing permissions param."))
			if (!banishment && banishment != 0) return reject(new Error("Missing banishment param."))
			if (!password || password && password.trim() === '') return reject(new Error("Missing password param."))
			if (!age) return reject(new Error("Missing age param."))
			if (!email || email && email.trim() === '') return reject(new Error("Missing email param."))
			if (!dateInsert) return reject(new Error("Missing date insert param."))
			if (typeof nickname !== 'string') return reject(new Error("nickname must be a string"))
			if (typeof permissions !== 'number') return reject(new Error("permissions must be a number"))
			if (typeof banishment !== 'number') return reject(new Error("banishment must be a number"))
			if (typeof avatar !== 'string') return reject(new Error("avatar must be a string"))
			if (typeof password !== 'string') return reject(new Error("password must be a string"))
			if (typeof first_name !== 'string') return reject(new Error("first_name must be a string"))
			if (typeof last_name !== 'string') return reject(new Error("last_Name must be a string"))
			if (typeof age !== 'string') return reject(new Error("age must be a number"))
			if (typeof phone_number !== 'string') return reject(new Error("phone_number must be a string"))
			if (typeof email !== 'string') return reject(new Error("email must be a string"))
			hash(password, 10)
				.then((hash: string) => {
					db.query('INSERT INTO members (`member_username`, `member_permissions`, `member_banishment`, `member_avatar`, `member_password`, `member_first_name`, `member_last_name`, `member_age`, `member_phone_number`, `member_email`, `member_date_insert`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [nickname, permissions, banishment, avatar, hash, first_name, last_name, age, phone_number, email, dateInsert], (err, result: Array<IObject>): void => {
						if (err) return reject(new Error(err.message))
						return resolve(result)
					})
				})
				.catch((err: IObject) => {
					reject(new Error('error whit password hash'))
				})
		})
	}
	public put(user: IUserInfos, userId: string, newSettings: IMember): Promise<IObject | Error> {
		return new Promise<IObject | Error>((resolve, reject) => {
			if (!hasPermissions(user.permissions, ['UPDATE_MEMBERS']) && user.id != userId) return reject(new Error('Bad permissions.'))
			let passwordHash: string;
			if (newSettings.permissions) newSettings.permissions = parseInt(`${newSettings.permissions}`)
			if (newSettings.banishment) newSettings.banishment = parseInt(`${newSettings.banishment}`)
			if (newSettings.nickname && typeof newSettings.nickname !== 'string') return reject(new Error("nickname must be a string"))
			if (newSettings.permissions && typeof newSettings.permissions !== 'number') return reject(new Error("permissions must be a number"))
			if (newSettings.banishment && typeof newSettings.banishment !== 'number') return reject(new Error("banishment must be a number"))
			if (newSettings.avatar && typeof newSettings.avatar !== 'string') return reject(new Error("avatar must be a string"))
			if (newSettings.password && typeof newSettings.password !== 'string') return reject(new Error("password must be a string"))
			if (newSettings.first_name && typeof newSettings.first_name !== 'string') return reject(new Error("first_name must be a string"))
			if (newSettings.last_name && typeof newSettings.last_name !== 'string') return reject(new Error("last_Name must be a string"))
			if (newSettings.age && typeof newSettings.age !== 'string') return reject(new Error("age must be a number"))
			if (newSettings.phone_number && typeof newSettings.phone_number !== 'string') return reject(new Error("phone_number must be a string"))
			if (newSettings.email && typeof newSettings.email !== 'string') return reject(new Error("email must be a string"))
			db.query('SELECT * FROM members WHERE id = ? LIMIT 1', [userId], async (err, result: Array<IObject>) => {
				if (err) return reject(new Error(err.message))
				if (newSettings.permissions && !hasPermissions(user.permissions, ['ADMINISTRATOR'])) return reject(new Error('You don\'t have permissions for change permissions value.'))
				if (newSettings.banishment && !hasPermissions(user.permissions, ['BAN_MEMBERS'])) return reject(new Error('You don\'t have permissions for change banishment value.'))
				if (newSettings.password) passwordHash = await hash(newSettings.password, 10)
				else passwordHash = result[0].password
				const userSettings: IMember = {
					id: result[0].id,
					nickname: newSettings.nickname || result[0].nickname,
					permissions: newSettings.permissions || result[0].permissions,
					banishment: newSettings.banishment || result[0].banishment,
					avatar: newSettings.avatar || result[0].avatar,
					password: passwordHash,
					first_name: newSettings.first_name || result[0].first_name,
					last_name: newSettings.last_name || result[0].last_name,
					age: newSettings.age || result[0].age,
					phone_number: newSettings.phone_number || result[0].phone_number,
					email: newSettings.email || result[0].email,
					date_insert: result[0].date_insert
				}
				db.query('UPDATE `members` SET `nickname` = ?, `permissions` = ?, `banishment` = ?, `avatar` = ?, `password` = ?, `first_name` = ?, `last_name` = ?, `age` = ?, `phone_number` = ?, `email` = ?, `date_insert` = ? WHERE (`id` = ?);',
					[userSettings.nickname, userSettings.permissions, userSettings.banishment, userSettings.avatar, userSettings.password, userSettings.first_name, userSettings.last_name, userSettings.age, userSettings.phone_number, userSettings.email, userSettings.date_insert, userId],
					(err, result) => {
						if (err) return reject(new Error(err.message))
						resolve(userSettings)
					})
			})
		})
	}
	public delete(user: IUserInfos, userDelete: string): Promise<IObject | Error> {
		return new Promise<IObject | Error>((resolve, reject) => {
			if (!hasPermissions(user.permissions, ['DELETE_MEMBERS']) && user.id != userDelete) return reject(new Error('Bad permissions.'))
			db.query('DELETE FROM members WHERE id = ?', [userDelete], (err, result) => {
				if (err) return reject(new Error(err.message))
				resolve(result)
			})
		})
	}
}