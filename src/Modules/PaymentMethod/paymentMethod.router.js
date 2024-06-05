import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as validationSchema from './paymentMethod.validation.js'
import * as PC from './paymentMethod.controllers.js'
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.post('/',auth([role.SUPERADMIN]),expressAsyncHandler(PC.addPaymentMethod))
.get('/:paymentMethodId',vld(validationSchema.params),auth(Object.values(role)),expressAsyncHandler(PC.singlePaymentMethod))
.get('/',auth(Object.values(role)),expressAsyncHandler(PC.paymentMethods))
.put('/:paymentMethodId',vld(validationSchema.params),auth([role.SUPERADMIN]),expressAsyncHandler(PC.updatePaymentMethod))
.delete('/:paymentMethodId',vld(validationSchema.params),auth([role.SUPERADMIN]),expressAsyncHandler(PC.deletePaymentMethod))
export default router