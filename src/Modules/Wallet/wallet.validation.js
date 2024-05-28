import Joi from "joi";
import validation from "../../utils/validation.js";


export const getSpecialAccount = {
  params:Joi.object({
    accountId:Joi.custom(validation.id).required()
  })
}

export const accountData = {
  headers:validation.headers
}