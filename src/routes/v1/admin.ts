import { Router } from 'express';
import * as MemberCtrl from '../../controllers/v1/members';
import { Iroute } from '../../types'
const MemberRouter: Router = Router();

MemberRouter.post('/', MemberCtrl.createMember);

export const infos: Iroute = {
    route: "admin",
    version: 1,
    router: MemberRouter
};