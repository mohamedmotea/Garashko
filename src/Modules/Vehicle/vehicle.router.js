import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as VC from './vehicle.controller.js'
import * as validationSchema from './vehicle.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import vld from './../../Middlewares/validation.middleware.js';
import { role } from "../../utils/system-rules.js";
import multerMiddleware from "../../Middlewares/multer.middleware.js";
const router = Router()

router
.post('/',multerMiddleware().single('faceId'),vld(validationSchema.addVehicle),
auth([role.USER,role.SUPERADMIN,role.GARAGEOWNER]),expressAsyncHandler(VC.addVehicle))

.put('/:vehicleId',multerMiddleware().single('faceId'),vld(validationSchema.updatedVehicle),
auth([role.USER,role.SUPERADMIN,role.GARAGEOWNER]),expressAsyncHandler(VC.updateVehicle))

.get('/vehicles',auth([role.USER,role.GARAGEOWNER,role.SUPERADMIN]),expressAsyncHandler(VC.myVehicle))
.get('/',auth([role.SUPERADMIN,role.SUPERADMIN]),expressAsyncHandler(VC.allVehicles))
.delete('/:vehicleId',vld(validationSchema.idParams),auth([role.USER,role.GARAGEOWNER,role.SUPERADMIN]),expressAsyncHandler(VC.deleteVehicle))
export default router