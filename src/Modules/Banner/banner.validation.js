import Joi from "joi";
import validation from "../../utils/validation.js";


export const params = {
  params:Joi.object({
    bannerId:Joi.custom(validation.id).required()
  })
}

export const accountData = {
  headers:validation.headers
}