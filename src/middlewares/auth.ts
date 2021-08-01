import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { err } from '../utils/functions';

import type { Response } from 'express';

export default (req: any, res: Response, next: any) => {
    try {
        if (!req.headers || req.headers && !req.headers.authorization) throw 'Missing authorization header.'
        const requestToken = req.headers.authorization?.split(' ')[1];
        const requestAuthor = req.headers.authorization?.split(' ')[0];
        if (!requestToken || !requestAuthor) throw 'Invalid authorization header.'
        const decoded: any = verify(requestToken, config.tokens.secret);
        if (requestAuthor != decoded.userId) throw 'Bad user.';
        const userPermissions: string[] = [];
        for (const permission of config.permissions) {
            const rest = decoded.userPermissions % permission.value;
            if (rest == 0 && decoded.userPermissions != 0) {
                userPermissions.push(permission.permission);
                break;
            }
            if (rest < decoded.userPermissions) {
                userPermissions.push(permission.permission);
                decoded.userPermissions = rest
            }
        }
        req.user = {
            id: decoded.userId,
            permissions: userPermissions
        }
        next()
    } catch (e) {
        res.status(401).json(err('Requete non authentifiée'));
    }
}