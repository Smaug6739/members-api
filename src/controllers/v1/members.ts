import { MemberClass } from '../../assets/classes/v1/member';
import { IObject, IMember, IUserInfos } from '../../types';
import { checkAndChange } from '../../utils/functions';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';
const Members = new MemberClass();

export function login(req: IObject, res: IObject): void {
    Members.login(req.body.email, req.body.password)
        .then(result => {
            const token = sign({
                exp: Math.floor(Math.floor(Date.now() / 1000) + (6 * 60 * 60)),
                expiresIn: 20000,
                userId: result.id,
                userPermissions: result.permissions
            }, config.secret)

            res.status(200).json(checkAndChange({
                auth: {
                    auth: true,
                    token: token,
                    client_id: result.id
                },
                user: result
            }))
        })
        .catch(error => res.json(checkAndChange(error.message)))
}
export function createMember(req: IObject, res: IObject): void {
    Members.add(
        req.body.nickname,
        1,
        1,
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
        .catch(error => res.json(checkAndChange(error.message)))
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
        permissions: req.user.permissions
    }
    Members.put(userInfos, newSettings)
        .then(result => res.status(201).json(checkAndChange(result)))
        .catch(error => res.json(checkAndChange(error.message)))
}