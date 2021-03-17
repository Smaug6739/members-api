import { MemberClass } from '../../assets/classes/v1/member';
import { IObject } from '../../types';
import { checkAndChange } from '../../utils/functions';
const Members = new MemberClass();

export function login(req: IObject, res: IObject): void {
    Members.login(req.body.email, req.body.password)
        .then(result => res.status(200).json(checkAndChange(result)))
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