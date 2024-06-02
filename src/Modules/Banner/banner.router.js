import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as validationSchema from './banner.validation.js'
import * as BC from './banner.controller.js'
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";
import multerMiddleware from "../../Middlewares/multer.middleware.js";

const router = Router()

router
.post('/',auth([role.SUPERADMIN]),multerMiddleware().single('image'),expressAsyncHandler(BC.addBanner))
.put('/:bannerId',vld(validationSchema.params),multerMiddleware().single('image'),auth([role.SUPERADMIN]),expressAsyncHandler(BC.updateBanner))
.get('/:bannerId',vld(validationSchema.params),auth(Object.values(role)),expressAsyncHandler(BC.singleBanner))
.get('/',auth(Object.values(role)),expressAsyncHandler(BC.banners))
.delete('/:bannerId',vld(validationSchema.params),auth([role.SUPERADMIN]),expressAsyncHandler(BC.deleteBanner))
export default router