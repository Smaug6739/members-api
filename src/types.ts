import { Router } from "express";

//Config
export interface Iconfig {
    readonly port: number;
    readonly production?: Boolean;
    readonly database: {
        readonly host: string;
        readonly user: string;
        readonly password: string;
        readonly database: string;
    }
    readonly secret: string
}
//Router
export interface Iroute {
    route: string;
    version: number;
    router: Router;
}

//Responce
export interface IResponce {
    status: string,
    timestamp: number,
    result?: any
    message?: string
}

export interface IObject {
    [index: string]: any
}