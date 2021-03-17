import { Router } from 'express';
import * as MemberCtrl from '../../controllers/v1/members';
import { Iroute } from '../../types'
const MemberRouter: Router = Router();

MemberRouter.post('/', MemberCtrl.createMember);
MemberRouter.post('/login', MemberCtrl.login);

export const infos: Iroute = {
    route: "members",
    version: 1,
    router: MemberRouter
};