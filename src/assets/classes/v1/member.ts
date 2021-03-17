import db from '../../../models/db';
import { IObject } from '../../../types';
import { hash, compare } from "bcrypt";
export class MemberClass {

    public login(email: string, password: string): Promise<IObject> {
        return new Promise((resolve, reject) => {
            if (!email || email && email.trim() === '') return;
            if (!password || password && password.trim() === '') return;
            db.query('SELECT * FROM members WHERE email = ? LIMIT 1', [email], (err: any, result: Array<IObject>): void => {
                if (err) return reject(new Error(err))
                compare(password, result[0].password).then((valid: Boolean): void => {
                    if (!valid) return reject(new Error('Bad password.'))
                    else return resolve(result[0])
                })
            })
        })
    }

    public add(
        nickname: string,
        permissions: number,
        banichement: number,
        avatar: string,
        password: string,
        firstName: string,
        lastName: string,
        age: number,
        phoneNumber: string,
        email: string,
        dateInsert: number
    ): Promise<IObject | Error> {
        return new Promise<IObject | Error>((resolve, reject) => {
            if (!nickname || nickname && nickname.trim() === '') return reject(new Error("Missing nickaname param."))
            if (!permissions) return reject(new Error("Missing permissions param."))
            if (!banichement) return reject(new Error("Missing banichement param."))
            if (!avatar || avatar && avatar.trim() === '') return reject(new Error("Missing avatar param."))
            if (!password || password && password.trim() === '') return reject(new Error("Missing password param."))
            if (!firstName || firstName && firstName.trim() === '') return reject(new Error("Missing first name param."))
            if (!lastName || lastName && lastName.trim() === '') return reject(new Error("Missing last name param."))
            if (!age) return reject(new Error("Missing age param."))
            if (!phoneNumber || phoneNumber && phoneNumber.trim() === '') return reject(new Error("Missing phone number param."))
            if (!email || email && email.trim() === '') return reject(new Error("Missing email param."))
            if (!dateInsert) return reject(new Error("Missing date insert param."))
            permissions = parseInt(`${permissions}`)
            banichement = parseInt(`${banichement}`)
            age = parseInt(`${age}`)
            dateInsert = parseInt(`${dateInsert}`)
            if (typeof nickname !== 'string') return reject(new Error("nickname must be a string"))
            if (typeof permissions !== 'number') return reject(new Error("permissions must be a number"))
            if (typeof banichement !== 'number') return reject(new Error("banichement must be a number"))
            if (typeof avatar !== 'string') return reject(new Error("avatar must be a string"))
            if (typeof password !== 'string') return reject(new Error("password must be a string"))
            if (typeof firstName !== 'string') return reject(new Error("first_name must be a string"))
            if (typeof lastName !== 'string') return reject(new Error("last_Name must be a string"))
            if (typeof age !== 'number') return reject(new Error("age must be a number"))
            if (typeof phoneNumber !== 'string') return reject(new Error("phone_number must be a string"))
            if (typeof email !== 'string') return reject(new Error("email must be a string"))
            hash(password, 10)
                .then((hash: string) => {
                    db.query('INSERT INTO members (`nickname`, `permissions`, `banishment`, `avatar`, `password`, `first_name`, `last_name`, `age`, `phone_number`, `email`, `date_insert`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [nickname, permissions, banichement, avatar, hash, firstName, lastName, age, phoneNumber, email, dateInsert], (err: any, result: Array<IObject>): void => {
                        if (err) return reject(new Error(err))
                        return resolve(result)
                    })
                })
                .catch((err: IObject) => {
                    reject(new Error('erreur lors du hachage du mot de passe'))
                })

        })

    }
}