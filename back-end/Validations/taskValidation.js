import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  projectId: Joi.string().required(),
  assignedTo: Joi.string().optional(),
});

export const updateTaskSchema = Joi.object({
  status: Joi.string().valid("todo", "in-progress", "done").required(),
});
