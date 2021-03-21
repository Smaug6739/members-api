import { IObject } from '../types';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { error } from '../utils/functions';

export default (req: IObject, res: IObject, next: any) => {
    try {
        if (!req.headers || req.headers && !req.headers.authorization) throw 'Missing authorization header.';
        const headerToken = req.headers.authorization.split(' ')[1];
        const headerUser = req.headers.authorization.split(' ')[0];

        if (!headerUser) throw 'Missing userId in header authorization';
        if (!headerToken) throw 'Missing token in header authorization'

        const decoded: any = verify(headerToken, config.secret);
        const decodedUserId = decoded.userId;
        const decodedUserPermissions: number = decoded.userId;
        if (decodedUserId == headerUser) {
            if (req.params.userId == decodedUserId || decodedUserPermissions >= 3) {
                req.user = {
                    id: decodedUserId,
                    permissions: decodedUserPermissions
                }
                next()
            }
            else throw 'bad authentification';
        }
        else throw 'bad authentification';
    } catch (err) {
        res.status(401).json(error(err));
    }
}