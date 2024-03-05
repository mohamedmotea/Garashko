import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as RC from './rate.controller.js'
import * as validationSchema from './rate.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import vld from './../../Middlewares/validation.middleware.js';
import { role } from "../../utils/system-rules.js";


const router = Router()

router.post('/:parkingId',auth(Object.values(role)),expressAsyncHandler(RC.addRate))

export default router