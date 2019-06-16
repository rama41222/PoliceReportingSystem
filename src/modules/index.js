const users  = require('./users/routes');
const reports  = require('./reports/routes');
const { operations } = require('./../lib');
module.exports = (app) => {
  app.use('/api/v1/users', users);
  app.use('/api/v1/reports', reports);
  app.use('/api/v1/health', operations.health);
};
