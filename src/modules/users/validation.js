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
      name: Joi.string().required(),
    },
  },
  edit: {
    body: {
      name: Joi.string(),
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
