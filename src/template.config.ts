import { Iconfig } from './types';
export const config: Iconfig = {
  port: 3000,
  production: false,
  database: {
    host: 'localhost',
    user: '<user>>',
    password: '<password>',
    database: '<db_name>'
  },
  secret: "Random values",
  permissions: [
    { value: 16, permission: 'BAN_MEMBERS' },
    { value: 8, permission: 'DELETE_MEMBERS' },
    { value: 4, permission: 'UPDATE_MEMBERS' },
    { value: 2, permission: 'VIEW_MEMBERS' },
    { value: 1, permission: 'ADMINISTRATOR' },
  ]
}
