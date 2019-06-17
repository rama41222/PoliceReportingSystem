const users  = require('./users/routes');
const status = require('http-status');
const expressValidation = require('express-validation');
const reports  = require('./reports/routes');
const { operations } = require('./../lib');
const { responseParser } = require('./../utils');

module.exports = (app) => {
  app.use('/api/v1/users', users);
  app.use('/api/v1/reports', reports);
  app.use('/api/v1/health', operations.health);
  app.use(responseParser);
};
