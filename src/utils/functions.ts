import { IResponce, IObject, IResponceError, IResponceSuccess } from '../types';
import { Response } from 'express'
import { config } from '../config';
export function success1(result: any): IResponce {
    const responce: IResponce = {
        status: 'success',
        timestamp: Date.now(),
        result: result
    }
    return responce
}
export function success(res: Response, data: IResponceSuccess) {
    if (data.headers && data.headers.length) data.headers.forEach(h => res.header(h))
    if (data.cookies && data.cookies.length) {
        data.cookies.forEach(c => {
            res.cookie(c.name, c.value,
                {
                    maxAge: c.maxAge || 3600000,
                    httpOnly: c.httpOnly || false,
                    domain: c.domain || '',
                    secure: config.production || false,
                    sameSite: c.sameSite || 'Lax'
                })
        })
    }
    res.status(data.httpCode || 200)
    res.json({
        status: 'success',
        httpCode: data.httpCode || 200,
        timestamp: Date.now(),
        result: {
            ...data.result
        }
    });
}
export function err(message: string): IResponce {
    const responce: IResponce = {
        status: 'error',
        timestamp: Date.now(),
        message: message
    }
    return responce
}
export function error(res: Response, error: IResponceError): void {
    res.status(error.httpCode || 500);
    res.json({
        status: 'error',
        httpCode: error.httpCode || 500,
        timestamp: Date.now(),
        message: error.message || 'An error occurred.'
    })
}
export function isErr(param: any): Boolean {
    return param instanceof Error
}

export function checkAndChange(this: any, obj: any): void {
    if (this.isErr(obj)) return this.err(obj.message || obj)
    else return this.success1(obj)
}

export function hasPermissions(userPermissions: string[], permissionsRequested: string[]): Boolean {
    if (!userPermissions || userPermissions.length) return false;
    if (userPermissions.includes('ADMINISTRATOR')) return true;
    for (const permRequested of permissionsRequested) {
        if (!userPermissions.includes(permRequested)) return false;
    }
    return true;
}

