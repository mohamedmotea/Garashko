import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from '../../Middlewares/validation.middleware.js';
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";
import * as SC from './service.controller.js'
import * as validationSchema from './service.validation.js'



const router = Router();

router.post('/',vld(validationSchema.addService),auth([role.SUPERADMIN]),expressAsyncHandler(SC.addService))
.put('/:serviceId',vld(validationSchema.updatedService),auth([role.SUPERADMIN]),expressAsyncHandler(SC.updateService))
.get('/',auth(Object.values(role)),expressAsyncHandler(SC.allService))
.get('/:serviceId',vld(validationSchema.idParams),auth(Object.values(role)),expressAsyncHandler(SC.singleService))
.delete('/:serviceId',vld(validationSchema.idParams),auth([role.SUPERADMIN]),expressAsyncHandler(SC.deleteService))

export default router