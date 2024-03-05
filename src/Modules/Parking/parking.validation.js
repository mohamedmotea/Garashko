
import Joi  from 'joi';
import validation from './../../utils/validation.js';

export const addParking = {
  body:Joi.object({
    parking_name:Joi.string().min(1).max(99).required(),
    address:Joi.string().min(1).max(99).required(),
    city:Joi.string().min(1).max(99).required(),
    state:Joi.string().min(1).max(99).required(),
    totalPlace:Joi.number().min(1).required(),
    pricePerDay:Joi.number().required(),
    pricePerMonth:Joi.number().required()
  }),
  headers:validation.headers
}

export const updatedParking = {
  body:Joi.object({
    parking_name:Joi.string().min(1).max(99),
    address:Joi.string().min(1).max(99),
    city:Joi.string().min(1).max(99),
    state:Joi.string().min(1).max(99),
    totalPlace:Joi.number().min(1),
    pricePerDay:Joi.number()
    ,pricePerMonth:Joi.number()
  }),
  headers:validation.headers
}

export const idParams = {
  params:Joi.object({
    parkingId:Joi.custom(validation.id).required()
  })
}