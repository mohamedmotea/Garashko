import Joi from "joi";
import { DateTime } from "luxon";
import validation from './../../utils/validation.js';


export const addVehicle = {
  body:Joi.object({
     licenseLetters:Joi.array().required().min(1).max(4)
     ,licenseNumbers:Joi.array().required().min(1).max(5)
     ,type:Joi.string().required().min(1).max(88)
     ,model:Joi.string().required().min(4).max(4)
     ,color:Joi.array()
     ,endOfLicense:Joi.date().required().min(DateTime.now())
     ,BeginningOfLicense:Joi.date().required().max(DateTime.now())
  }),
  headers:validation.headers
  
}
export const updatedVehicle = {
  body:Joi.object({
     licenseLetters:Joi.array().min(1).max(4)
   ,licenseNumbers:Joi.array().min(1).max(5)
   ,type:Joi.string().min(1).max(88)
   ,model:Joi.string().min(4).max(4)
   ,color:Joi.array()
   ,endOfLicense:Joi.date().min(DateTime.now())
   ,BeginningOfLicense:Joi.date().max(DateTime.now())
  }),
  headers:validation.headers
}
export const idParams = {
  params:Joi.object({
    vehicleId:Joi.custom(validation.id).required()
  }),
  headers:validation.headers
}