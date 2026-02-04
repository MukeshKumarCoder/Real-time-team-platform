import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().allow(""),
});
