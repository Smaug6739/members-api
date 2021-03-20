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
  secret: "Random values"
}
