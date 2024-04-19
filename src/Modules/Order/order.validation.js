
import Joi  from 'joi';
import validation from '../../utils/validation.js';
import { reservationStatus, serviceArr } from '../../utils/system-rules.js';

export const addOrder = {
  body:Joi.object({
    services:Joi.array().valid(...serviceArr),
    location:Joi.object({
      type:Joi.string().valid('Point').required(),
      coordinates:Joi.array().min(2).max(2).required()
    }).required()})
    ,headers:validation.headers
  }

export const updatedOrder = {
  body:Joi.object({
    newServices:Joi.array().valid(...serviceArr),
    removeService:Joi.array().valid(...serviceArr)
}),
params:Joi.object({
  orderId:Joi.custom(validation.id).required()
})
    ,headers:validation.headers
}

export const idParams = {
  params:Joi.object({
    orderId:Joi.custom(validation.id).required()
  })
}
export const administrationOrder = {
  params:Joi.object({
    orderId:Joi.custom(validation.id).required()
  }),
  body:Joi.object({
    status:Joi.string().valid(...Object.values(reservationStatus))
  }),
  headers:validation.headers
}