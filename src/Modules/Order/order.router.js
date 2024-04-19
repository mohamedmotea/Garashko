import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from '../../Middlewares/validation.middleware.js';
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";
import * as OR from './order.controller.js'
import * as validationSchema from './order.validation.js'



const router = Router();

router.post('/:orderId',vld(validationSchema.idParams),auth([role.SUPERADMIN]),expressAsyncHandler(OR.administrationOrder))
.post('/',vld(validationSchema.addOrder),auth(Object.values(role)),expressAsyncHandler(OR.addOrder))
.put('/:orderId',vld(validationSchema.updatedOrder),auth(Object.values(role)),expressAsyncHandler(OR.updateOrder))
.get('/user',auth(Object.values(role)),expressAsyncHandler(OR.userOrders))
.get('/',auth([role.SUPERADMIN]),expressAsyncHandler(OR.allOrders))
.get('/:orderId',vld(validationSchema.idParams),auth(Object.values(role)),expressAsyncHandler(OR.singleOrder))
.delete('/:orderId',vld(validationSchema.idParams),auth(Object.values(role)),expressAsyncHandler(OR.deleteOrder))

export default router