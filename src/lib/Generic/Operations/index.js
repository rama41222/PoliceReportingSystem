const { OK } = require('http-status');

async function health(req, res) {
  res.status(OK).send();
}

module.exports = {
  health
};
