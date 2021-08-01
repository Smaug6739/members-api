import { Router } from "express";

//Config
export interface Iconfig {
    readonly port: number;
    readonly domain: string;
    readonly production: boolean;
    readonly database: {
        readonly host: string;
        readonly user: string;
        readonly password: string;
        readonly database: string;
    }
    readonly permissions: Array<any>
    readonly tokens: {
        readonly access: number;
        readonly refresh: number;
        readonly secret: string;
    }
}
//Router
export interface Iroute {
    route: string;
    version: number;
    router: Router;
}

//Responce
export interface IResponce {
    status: string;
    timestamp: number;
    result?: any
    message?: string
}
//Object
export interface IObject {
    [index: string]: any
}

//Member
export interface IMember {
    id: number;
    nickname: string | null;
    permissions: number;
    banishment: number;
    avatar: string;
    password: string;
    first_name: string;
    last_name: string;
    age: string;
    phone_number: string;
    email: string;
    date_insert?: number
}

export interface IUserInfos {
    id: string;
    permissions: Array<string>;
}

export interface IResponceError {
    readonly httpCode?: number;
    readonly message?: string;
}
export interface IResponceSuccess {
    readonly httpCode?: number;
    readonly headers?: string[];
    readonly cookies?: Array<any>;
    readonly result?: any;
}