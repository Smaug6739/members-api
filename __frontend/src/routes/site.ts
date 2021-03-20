import { Router } from 'express';
//import * as MemberCtrl from '../../controllers/v1/members';
import { Iroute } from '../types';
const MemberRouter: Router = Router();

MemberRouter.get('/', (req, res) => {
  res.send('test')
});


export const infos: Iroute = {
  route: "",
  router: MemberRouter
};