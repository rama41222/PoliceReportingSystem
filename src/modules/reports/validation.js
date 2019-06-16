const Joi = require('joi');

module.exports = {
  list: {
    query: Joi.object().optional().keys({
      status: Joi.string().optional(),
    })
  },
  id: {
    params: {
      id: Joi.number().integer().min(1).required(),
    },
  },
  create: {
    body: {
      owner: Joi.string().required(),
      reg_number: Joi.string().required(),
      color: Joi.string().optional(),
      stolen_date: Joi.string().required(),
      description: Joi.string().optional(),
    },
  },
  edit: {
    body: {
      owner: Joi.string().optional(),
      reg_number: Joi.string().optional(),
      color: Joi.string().optional(),
      stolen_date: Joi.string().optional(),
      description: Joi.string().optional(),
    },
    params:{
      id: Joi.number().integer().min(1).required(),
    }
  },
};
