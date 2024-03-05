import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import auth from './../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";
import * as PC from './parking.controller.js'
import * as validationSchema from './parking.validation.js'



const router = Router();

router.post('/',vld(validationSchema.addParking),auth([role.GARAGEOWNER,role.SUPERADMIN]),expressAsyncHandler(PC.addParking))
.put('/:parkingId',vld(validationSchema.updatedParking),auth([role.GARAGEOWNER,role.SUPERADMIN]),expressAsyncHandler(PC.updateParking))
.delete('/:parkingId',vld(validationSchema.idParams),auth([role.GARAGEOWNER,role.SUPERADMIN]),expressAsyncHandler(PC.deleteParking))
.get('/:parkingId',vld(validationSchema.idParams),expressAsyncHandler(PC.singlePark))
.get('/',expressAsyncHandler(PC.AllParking))
export default router