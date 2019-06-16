/* eslint-disable global-require */
const app = require('./server');
const { connectSQL } = require('./database');

module.exports = async function bootstrap() {
  await connectSQL();
  require('./middleware')(app);
  require('./routes')(app);
  return app;
};
