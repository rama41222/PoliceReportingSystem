/* eslint-disable global-require */
const app = require('./server');
const { connectSQL, connectRedis } = require('./database');

module.exports = async function bootstrap() {
  await connectSQL();
  await connectRedis();
  require('./middleware')(app);
  require('./routes')(app);
  return app;
};
