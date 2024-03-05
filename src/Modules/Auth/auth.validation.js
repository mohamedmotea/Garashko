import Joi from "joi";
import { role } from './../../utils/system-rules.js';
import validation from './../../utils/validation.js';

export const signUp = {
  body:Joi.object({
    userName:Joi.string().min(3).max(99).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid(...Object.values(role)),
    phoneNumber:Joi.string().regex(/^01[0|1|2|5][0-9]{8}$/).required()
  })
}
export const verifyEmail = {
  query:Joi.object({
    email:Joi.string().required()
  })
}
export const signIn = {
  body:Joi.object({
    email:Joi.string().required().email(),
    password:Joi.string().required().min(6)
  })
}

export const updateAccount = {
  body:Joi.object({
    userName:Joi.string().min(3).max(99),
    email:Joi.string().email(),
    oldPassword:Joi.string().min(6),
    newPassword:Joi.string().min(6),
    phoneNumber:Joi.string().regex(/^01[0|1|2|5][0-9]{8}$/)
  }),
  headers:validation.headers
}
