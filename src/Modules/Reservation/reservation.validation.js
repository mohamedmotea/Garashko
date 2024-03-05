import joi from "joi";
import { paymentMethod } from "../../utils/system-rules.js";
import validation from './../../utils/validation.js';
import joidate from "@joi/date";
const Joi = joi.extend(joidate)
export const addReservation = {
  body:Joi.object({
    fromDate:Joi.date().format("YYYY-MM-DD").greater(Date.now() - 24*60*60 *1000),
    toDate:Joi.date().format("YYYY-MM-DD").greater(Joi.ref('fromDate')),
    vehicle:Joi.custom(validation.id),
    paymentMethod:Joi.valid(...Object.values(paymentMethod)).required(),
    isDay:Joi.boolean(),
    isMonth:Joi.boolean(),
    quantity:Joi.number().required(),
  })
}