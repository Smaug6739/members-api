import { Router } from 'express';
import * as AuthCtrl from '../../controllers/v2/auth';
import { Iroute } from '../../types';
const AuthRouter: Router = Router();

AuthRouter.post('/token/:userId', AuthCtrl.auth);
AuthRouter.post('/refresh/:userId', AuthCtrl.refreshToken);


export const infos: Iroute = {
	route: "auth",
	version: 2,
	router: AuthRouter
};