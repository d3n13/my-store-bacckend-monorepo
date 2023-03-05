import * as Joi from "joi";

export const createProductPayloadSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number().min(0).required(),
});
