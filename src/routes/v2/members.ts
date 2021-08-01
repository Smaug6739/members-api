import { Router } from 'express';
import * as MemberCtrl from '../../controllers/v2/members';
import { Iroute } from '../../types';
import auth from '../../middlewares/auth';
const MemberRouter: Router = Router();

MemberRouter.post('/', MemberCtrl.createMember);

MemberRouter.get('/:userId', auth, MemberCtrl.getUser);

MemberRouter.put('/:userId', auth, MemberCtrl.updateMember);

MemberRouter.delete('/:userId', auth, MemberCtrl.deleteMember);

export const infos: Iroute = {
	route: "members",
	version: 2,
	router: MemberRouter
};