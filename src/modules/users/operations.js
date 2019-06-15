const Users = require('./model');

async function health(req, res) {
  try{
    const employee = new Users({
      name: 'P1'
    });
    await employee.save();
  } catch (e) {
    res.status(400).send(e);
    
  }
  res.status(200).send();
}

module.exports = {
  health
};
