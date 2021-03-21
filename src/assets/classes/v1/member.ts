import db from '../../../models/db';
import { IMember, IObject, IUserInfos } from '../../../types';
import { hash, compare } from "bcrypt";

export class MemberClass {

    public auth(email: string, password: string): Promise<IObject> {
        return new Promise((resolve, reject) => {
            if (!email || email && email.trim() === '') return;
            if (!password || password && password.trim() === '') return;
            db.query('SELECT * FROM members WHERE email = ? LIMIT 1', [email], (err, result: Array<IObject>): void => {
                if (err) return reject(new Error(err.message))
                compare(password, result[0].password).then((valid: Boolean): void => {
                    if (!valid) return reject(new Error('Bad password.'))
                    else return resolve(result[0])
                })
            })
        })
    }

    public get(user: IUserInfos): Promise<IObject> {
        return new Promise((resolve, reject) => {
            if (!user || !user.id) return reject(new Error('Missing user param.'))
            db.query('SELECT * FROM members WHERE id = ? LIMIT 1', [user.id], (err, result) => {
                if (err) return reject(new Error(err.message))
                resolve(result[0])
            })
        })
    }

    public add(
        nickname: string,
        permissions: number,
        banishment: number,
        avatar: string,
        password: string,
        first_name: string,
        last_name: string,
        age: number,
        phone_number: string,
        email: string,
        dateInsert: number
    ): Promise<IObject | Error> {
        return new Promise<IObject | Error>((resolve, reject) => {
            if (!nickname || nickname && nickname.trim() === '') return reject(new Error("Missing nickaname param."))
            if (!permissions) return reject(new Error("Missing permissions param."))
            if (!banishment) return reject(new Error("Missing banishment param."))
            if (!avatar || avatar && avatar.trim() === '') return reject(new Error("Missing avatar param."))
            if (!password || password && password.trim() === '') return reject(new Error("Missing password param."))
            if (!first_name || first_name && first_name.trim() === '') return reject(new Error("Missing first name param."))
            if (!last_name || last_name && last_name.trim() === '') return reject(new Error("Missing last name param."))
            if (!age) return reject(new Error("Missing age param."))
            if (!phone_number || phone_number && phone_number.trim() === '') return reject(new Error("Missing phone number param."))
            if (!email || email && email.trim() === '') return reject(new Error("Missing email param."))
            if (!dateInsert) return reject(new Error("Missing date insert param."))
            permissions = parseInt(`${permissions}`)
            banishment = parseInt(`${banishment}`)
            age = parseInt(`${age}`)
            dateInsert = parseInt(`${dateInsert}`)
            if (typeof nickname !== 'string') return reject(new Error("nickname must be a string"))
            if (typeof permissions !== 'number') return reject(new Error("permissions must be a number"))
            if (typeof banishment !== 'number') return reject(new Error("banishment must be a number"))
            if (typeof avatar !== 'string') return reject(new Error("avatar must be a string"))
            if (typeof password !== 'string') return reject(new Error("password must be a string"))
            if (typeof first_name !== 'string') return reject(new Error("first_name must be a string"))
            if (typeof last_name !== 'string') return reject(new Error("last_Name must be a string"))
            if (typeof age !== 'number') return reject(new Error("age must be a number"))
            if (typeof phone_number !== 'string') return reject(new Error("phone_number must be a string"))
            if (typeof email !== 'string') return reject(new Error("email must be a string"))
            hash(password, 10)
                .then((hash: string) => {
                    db.query('INSERT INTO members (`nickname`, `permissions`, `banishment`, `avatar`, `password`, `first_name`, `last_name`, `age`, `phone_number`, `email`, `date_insert`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [nickname, permissions, banishment, avatar, hash, first_name, last_name, age, phone_number, email, dateInsert], (err, result: Array<IObject>): void => {
                        if (err) return reject(new Error(err.message))
                        return resolve(result)
                    })
                })
                .catch((err: IObject) => {
                    reject(new Error('error whit password hash'))
                })
        })
    }
    public put(user: IUserInfos, newSettings: IMember): Promise<IObject | Error> {
        return new Promise<IObject | Error>((resolve, reject) => {
            let passwordHash: string;
            if (newSettings.permissions) newSettings.permissions = parseInt(`${newSettings.permissions}`)
            if (newSettings.banishment) newSettings.banishment = parseInt(`${newSettings.banishment}`)
            if (newSettings.age) newSettings.age = parseInt(`${newSettings.age}`)
            if (newSettings.nickname && typeof newSettings.nickname !== 'string') return reject(new Error("nickname must be a string"))
            if (newSettings.permissions && typeof newSettings.permissions !== 'number') return reject(new Error("permissions must be a number"))
            if (newSettings.banishment && typeof newSettings.banishment !== 'number') return reject(new Error("banishment must be a number"))
            if (newSettings.avatar && typeof newSettings.avatar !== 'string') return reject(new Error("avatar must be a string"))
            if (newSettings.password && typeof newSettings.password !== 'string') return reject(new Error("password must be a string"))
            if (newSettings.first_name && typeof newSettings.first_name !== 'string') return reject(new Error("first_name must be a string"))
            if (newSettings.last_name && typeof newSettings.last_name !== 'string') return reject(new Error("last_Name must be a string"))
            if (newSettings.age && typeof newSettings.age !== 'number') return reject(new Error("age must be a number"))
            if (newSettings.phone_number && typeof newSettings.phone_number !== 'string') return reject(new Error("phone_number must be a string"))
            if (newSettings.email && typeof newSettings.email !== 'string') return reject(new Error("email must be a string"))
            db.query('SELECT * FROM members WHERE id = ? LIMIT 1', [user.id], async (err, result: Array<IObject>) => {
                if (err) return reject(new Error(err.message))
                if (newSettings.permissions && newSettings.permissions !== result[0].permissions && result[0].permissions != 4) return reject(new Error('You don\'t have permissions for change permissions value.'))
                if (newSettings.banishment && result[0].permissions <= 3) return reject(new Error('You don\'t have permissions for change banishment value.'))
                if (newSettings.password) passwordHash = await hash(newSettings.password, 10)
                const userSettings: IMember = {
                    id: user.id,
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
                    [userSettings.nickname, userSettings.permissions, userSettings.banishment, userSettings.avatar, userSettings.password, userSettings.first_name, userSettings.last_name, userSettings.age, userSettings.phone_number, userSettings.email, userSettings.date_insert, user.id],
                    (err, result) => {
                        if (err) return reject(new Error(err.message))
                        resolve(userSettings)
                    })
            })
        })
    }
    public delete(user: IUserInfos, userDelete: number): Promise<IObject | Error> {
        return new Promise<IObject | Error>((resolve, reject) => {
            db.query('DELETE FROM members WHERE id = ?', [userDelete], (err, result) => {
                if (err) return reject(new Error(err.message))
                resolve(result)
            })
        })
    }
}