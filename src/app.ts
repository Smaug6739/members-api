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
        this.app.set('trust proxy', true)
        this.app.get('/test', (req: any, res: any) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log('ip : ' + ip); // ip address of the user
            res.end()
        })
    }
    private handleMiddlewares(): void {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(function (req: any, res: any, next: Function) {
            const origin = req.headers.origin;
            if (origin) res.setHeader('Access-Control-Allow-Origin', origin)

            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next()
        })
    }
    public start(): void {
        this.handleMiddlewares();
        this.handleRoutes();
        this.app.listen(this.port, () => {
            console.log(`Started on port ${this.port}`)
        })
    }
}