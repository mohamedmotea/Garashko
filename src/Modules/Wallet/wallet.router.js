import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as validationSchema from './wallet.validation.js'
import * as WC from './wallet.controller.js'
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.patch('/:userId',auth([role.SUPERADMIN]),expressAsyncHandler(WC.addAmount))
.get('/user',auth(Object.values(role)),expressAsyncHandler(WC.userWallet))
.get('/:walletId',auth([role.SUPERADMIN]),expressAsyncHandler(WC.singleWallet))
.get('/',auth([role.SUPERADMIN]),expressAsyncHandler(WC.wallets))

export default router