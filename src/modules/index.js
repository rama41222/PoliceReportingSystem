const users  = require('./users/routes');

module.exports = (app) => {
  app.use('/api/v1/users', users);
};
