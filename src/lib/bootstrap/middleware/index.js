const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { responseParser } = require('../../../utils');
const { corsConfig } = require('../../../config');

module.exports = (app) => {
  app.use(cors(corsConfig));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.use(responseParser);
};
