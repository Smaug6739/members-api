import { Router } from 'express';
import * as AuthCtrl from '../../controllers/v2/auth';
import { Iroute } from '../../types';
const MemberRouter: Router = Router();

MemberRouter.post('/token/:userId', AuthCtrl.auth);
MemberRouter.post('/refresh/:userId', AuthCtrl.refreshToken);


export const infos: Iroute = {
	route: "auth",
	version: 2,
	router: MemberRouter
};