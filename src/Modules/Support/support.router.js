import { Router } from "express";
import  expressAsyncHandler  from 'express-async-handler';
import vld from '../../Middlewares/validation.middleware.js';
import * as SC from './support.controller.js'
import auth from '../../Middlewares/auth.middleware.js';

const router = Router()

router
.get('/',expressAsyncHandler(SC.support))

export default router