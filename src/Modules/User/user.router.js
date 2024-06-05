import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from './../../Middlewares/validation.middleware.js';
import * as validationSchema from './user.validation.js'
import * as UC from './user.controller.js'
import auth from './../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.get('/users',auth(role.SUPERADMIN),expressAsyncHandler(UC.users))
.get('/:accountId',vld(validationSchema.getSpecialAccount),expressAsyncHandler(UC.getSpecialAccount))
.get('/',vld(validationSchema.accountData),auth(Object.values(role)),expressAsyncHandler(UC.getAccountData))
.delete('/:accountId',auth(role.SUPERADMIN),expressAsyncHandler(UC.deleteUser))

export default router