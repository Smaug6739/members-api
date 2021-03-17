import { IObject } from '../types';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { error } from '../utils/functions';

export default (req: IObject, res: IObject, next: any) => {
    try {
        if (!req.headers || req.headers && !req.headers.authorization) throw 'Missing authorization header.';
        const token = req.headers.authorization.split(' ')[1];
        const decoded: any = verify(token, config.secret);
        const userId = decoded.userId;
        const userPermissions: number = decoded.userId;
        const userAuth = req.params.userId;
        if (!userAuth) throw 'Missing userId param in request';
        if (userId == userAuth || userPermissions >= 3) {
            next()
        }
        else throw 'bad authentification';
    } catch (err) {
        res.status(401).json(error(err));
    }
}