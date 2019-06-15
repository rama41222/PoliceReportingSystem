const User = require('./model');

async function health(req, res) {
  console.log(User);
  await User.findOne({ where: { id: 1 } });
  res.status(200).send();
}

module.exports = {
  health
};
