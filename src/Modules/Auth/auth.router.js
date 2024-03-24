import { Router } from "express";
import expressAsyncHandler from 'express-async-handler'
import vld from './../../Middlewares/validation.middleware.js';
import * as validationSchema from './auth.validation.js'
import * as AC from './auth.controller.js'
import auth from './../../Middlewares/auth.middleware.js';
import { role } from "../../utils/system-rules.js";

const router = Router()

router
.post('/signUp',vld(validationSchema.signUp),expressAsyncHandler(AC.signUp))
.post('/signIn',vld(validationSchema.signIn),expressAsyncHandler(AC.signIn))
.get('/verify',vld(validationSchema.verifyEmail),expressAsyncHandler(AC.verifyEmail))
.put('/',vld(validationSchema.updateAccount),auth(Object.values(role)),expressAsyncHandler(AC.updateAccount))
.delete('/',auth(Object.values(role)),expressAsyncHandler(AC.deleteAccount))
// google auth
.post('/signUpWithGoogle',vld(validationSchema.googleAuth),expressAsyncHandler(AC.googleSignUp))
.post('/signInWithGoogle',vld(validationSchema.googleAuth),expressAsyncHandler(AC.googleLogin))
export default router