import { Iconfig } from './types';
export const config: Iconfig = {
  port: 3000,
  domain: 'localhost',
  production: false,
  database: {
    host: 'localhost',
    user: '<user>',
    password: '<password>',
    database: '<db_name>'
  },
  permissions: [
    { value: 16, permission: 'BAN_MEMBERS' },
    { value: 8, permission: 'DELETE_MEMBERS' },
    { value: 4, permission: 'UPDATE_MEMBERS' },
    { value: 2, permission: 'VIEW_MEMBERS' },
    { value: 1, permission: 'ADMINISTRATOR' },
  ],
  tokens: {
    access: 600, // 10 mins in seconds 
    refresh: 86400, // 24h in seconds
    secret: "Random values",
  }
}
