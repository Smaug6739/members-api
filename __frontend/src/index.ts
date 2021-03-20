import { FrontendApp } from './frontend';
import { config } from './config';

const server: FrontendApp = new FrontendApp(config)
server.start();