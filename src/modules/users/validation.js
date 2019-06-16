const Joi = require('joi');

module.exports = {
  list: {
    query: Joi.object().optional().keys({
      isOccupied: Joi.string().optional(),
    })
  },
  id: {
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
      name: Joi.string().optional(),
    },
    params:{
      id: Joi.string().required(),
    }
  },

};
