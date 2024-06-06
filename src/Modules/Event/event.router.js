import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as validationSchema from './event.validation.js'
import * as EC from './event.controller.js'
import auth from '../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.post('/subscribe/:eventId',vld(validationSchema.params),auth(Object.values(role)),expressAsyncHandler(EC.subscribeEvent))
.patch('/user/:eventId',auth([role.SUPERADMIN]),expressAsyncHandler(EC.subscribeHandlerEvent))
.post('/',auth([role.SUPERADMIN]),expressAsyncHandler(EC.addEvent))
.get('/:eventId',vld(validationSchema.params),auth(Object.values(role)),expressAsyncHandler(EC.singleEvent))
.get('/',auth(Object.values(role)),expressAsyncHandler(EC.events))
.put('/:eventId',vld(validationSchema.params),auth([role.SUPERADMIN]),expressAsyncHandler(EC.updateEvent))
.delete('/:eventId',vld(validationSchema.params),auth([role.SUPERADMIN]),expressAsyncHandler(EC.deleteEvent))
export default router