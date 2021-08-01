import { Router } from 'express';
import * as AuthCtrl from '../../controllers/v2/auth';
import { Iroute } from '../../types';
import auth from '../../middlewares/auth';

const AuthRouter: Router = Router();

AuthRouter.post('/token/:userId', AuthCtrl.auth);
AuthRouter.post('/token/refresh/:userId', AuthCtrl.refreshToken);
AuthRouter.patch('/:userId', auth, AuthCtrl.updateAuth);


export const infos: Iroute = {
	route: "auth",
	version: 2,
	router: AuthRouter
};