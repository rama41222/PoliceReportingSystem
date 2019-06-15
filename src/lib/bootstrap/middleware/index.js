const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { corsConfig } = require('../../../config');

module.exports = (app) => {
  app.use(cors(corsConfig));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined'));
};
