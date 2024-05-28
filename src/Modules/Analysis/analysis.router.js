import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as validationSchema from './analysis.validation.js'
import * as AC from './analysis.controller.js'
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.get('/users',auth([role.SUPERADMIN]),expressAsyncHandler(AC.users))
.get('/vehicles',auth([role.SUPERADMIN]),expressAsyncHandler(AC.vehicles))
.get('/parking',auth([role.SUPERADMIN]),expressAsyncHandler(AC.parkings))
.get('/reservation',auth([role.SUPERADMIN]),expressAsyncHandler(AC.reservation))

export default router