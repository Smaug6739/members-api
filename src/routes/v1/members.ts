import { Router } from 'express';
import * as MemberCtrl from '../../controllers/v1/members';
import { Iroute } from '../../types';
import auth from '../../middlewares/auth';
const MemberRouter: Router = Router();

MemberRouter.post('/', MemberCtrl.createMember);
MemberRouter.post('/login', MemberCtrl.login);
MemberRouter.post('/test/auth/:userId', auth, MemberCtrl.login);

export const infos: Iroute = {
    route: "members",
    version: 1,
    router: MemberRouter
};