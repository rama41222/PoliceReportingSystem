const User = require('./model');
const Report = require('./../reports/model');
const { setPoliceman, reSyncPoliceQueue } = require('./../../services/police');
const { getNextPendingReport, reSyncReports } = require('./../../services/reports');

async function list(req, res) {
  
  const isOccupied = req.query.isOccupied;
  const options = {};
  options.limit = parseInt(req.query.limit,10) || 100;
  options.skip = parseInt(req.query.skip,10) || 0;
  
  if(isOccupied) {
    options.where = { is_occupied: isOccupied };
  }
  
  const users = await User.findAll(options).catch(e => (res.status(400).json({ message: 'Database error'})));
  res.status(200).json({ users });
}

async function listOne(req, res) {
  
  const { id } = req.params;
  const user = await User.findAll({ where: { id }});
  res.status(200).json({ user });
}

async function create(req, res) {
  
  const user = new User(req.body);
  
  try {
    
    const newUser = await user.save();
    
    if(newUser) {
      
      const nextUnResolvedReport = await getNextPendingReport().catch(console.error);
    
      if(nextUnResolvedReport) {
        
        await Report.update({ assignee_id: newUser.id, status: 'PENDING' },{ where: { id: nextUnResolvedReport }});
        await User.update({ is_occupied: true }, { where: { id: newUser.id }, plain: true, returning: true });
        newUser.is_occupied = true;
        return res.status(200).json({ newUser , message: 'Report has been assigned to new police officer !'})
      }
    
      const isSet =  await setPoliceman(newUser.id);
    
      if(!isSet) {
        return res.status(400).send('Queue is inactive');
      }
      res.status(200).send(user);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function edit(req, res) {
  const { id } = req.params;
  const update = await User.update(req.body, { where: { id }});
  
  if(!update && update === 0) {
    return res.status(201).send();
  }
  
  await reSyncPoliceQueue();
  res.status(200).json({ message: 'Updated successfully'});
}

async function remove(req, res) {
  
  const { id } = req.params;
  await User.remove({ where: { id }});
  await reSyncPoliceQueue();
  res.status(200).send();
}

module.exports = {
  list,
  listOne,
  create,
  edit,
  remove
};
