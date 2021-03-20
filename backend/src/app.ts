import { readdirSync } from 'fs';
import { join } from 'path';
import * as express from 'express';
import { Iconfig } from './types'


export class App {
    private app: express.Application;
    public port: number;
    public config: Iconfig;
    constructor(config: Iconfig) {
        this.app = express();
        this.port = config.port;
        this.config = config
        console.log('Starting...')
    }
    private handleRoutes(): void {
        readdirSync(join(__dirname, 'routes')).forEach(dir => {
            const routes = readdirSync(join(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'))
            for (const file of routes) {
                const getFileName = require(join(__dirname, `routes/${dir}/${file}`))
                this.app.use(`/api/v${getFileName.infos.version}/${getFileName.infos.route}`, getFileName.infos.router)
                console.log(`Route chargée : /api/v${getFileName.infos.version}/${getFileName.infos.route}`);
            }
        })
    }
    private handleMiddlewares(): void {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }
    public start(): void {
        this.handleMiddlewares();
        this.handleRoutes();
        this.app.listen(this.port, () => {
            console.log(`Started on port ${this.port}`)
        })
    }
}