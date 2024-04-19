
import Joi  from 'joi';
import validation from '../../utils/validation.js';
import { serviceArr } from '../../utils/system-rules.js';

export const addService = {
  body:Joi.object({
    service_type:Joi.string().valid(...serviceArr).required()
    ,creditPoint:Joi.number().required()
    ,discount:Joi.number()
  }),
  headers:validation.headers
}

export const updatedService = {
  body:Joi.object({
    service_type:Joi.string().valid(...serviceArr)
    ,creditPoint:Joi.number()
    ,discount:Joi.number()
  }),
  headers:validation.headers,
  params:Joi.object({
    serviceId:Joi.custom(validation.id).required()
  })
}

export const idParams = {
  params:Joi.object({
    serviceId:Joi.custom(validation.id).required()
  })
}