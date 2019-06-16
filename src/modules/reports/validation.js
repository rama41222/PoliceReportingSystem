const Joi = require('joi');

module.exports = {
  list: {
    query: {
      id: Joi.string(),
    },
  },
  listOne: {
    params: {
      id: Joi.string().required(),
    },
  },
  create: {
    body: {
      owner: Joi.string().required(),
      reg_number: Joi.string().required(),
      color: Joi.string(),
      stolen_date: Joi.string().required(),
      description: Joi.string(),
    },
  },
  edit: {
    body: {
      owner: Joi.string(),
      reg_number: Joi.string(),
      color: Joi.string(),
      stolen_date: Joi.string(),
      description: Joi.string(),
    },
    params:{
      id: Joi.string().required(),
    }
  },
  resolve: {
    params:{
      id: Joi.string().required(),
    }
  },
  remove: {
    params:{
      id: Joi.string().required(),
    }
  },
};
