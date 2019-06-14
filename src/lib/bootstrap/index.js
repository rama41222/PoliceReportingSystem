/* eslint-disable global-require */
const app = require('./server');
const { connect } = require('./database');

module.exports = async function bootstrap() {
  await connect();
  require('./middleware')(app);
  require('./routes')(app);
  return app;
};
