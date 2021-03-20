import { Router } from 'express'
export interface Iconfig {
  port: number,
  database: {
    name: string,
    host: string,
    port: number,
    user: string,
    password: string
  }
}

//Router
export interface Iroute {
  route: string;
  router: Router;
}