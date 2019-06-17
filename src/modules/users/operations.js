const User = require('./model');
const Report = require('./../reports/model');
const { setPoliceman, reSyncPoliceQueue } = require('./../../services/police');
const { getNextPendingReport, reSyncReports } = require('./../../services/reports');

/**
 * This function will list all the policemen
 * This function takes the parameter isOccupied, which can be true or false
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
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

/**
 * This function will list down only one policeman
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function listOne(req, res) {
  
  const { id } = req.params;
  const user = await User.findAll({ where: { id }});
  res.status(200).json({ user });
}

/**
 * This function will create a policeman and assigns him to a report if there's a unresolved case
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function create(req, res) {
  // Create a new policeman using the modal
  const user = new User(req.body);
  
  try {
    
    //Save the policeman in database
    const newUser = await user.save();
    
    if(newUser) {
      
      //Fetch the next available report from the queue
      //If this is available, policeman will be assigned with this report automatically
      //else policeman will be saved and will be on idle till next report is available
      const nextUnResolvedReport = await getNextPendingReport().catch(console.error);
    
      if(nextUnResolvedReport) {
        
        await Report.update({ assignee_id: newUser.id, status: 'PENDING' },{ where: { id: nextUnResolvedReport }});
        await User.update({ is_occupied: true }, { where: { id: newUser.id }, plain: true, returning: true });
        newUser.is_occupied = true;
        return res.status(200).json({ newUser , message: 'Report has been assigned to new police officer !'})
      }
      
      //Saving policeman to the redis queue
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

/**
 * This function will edit the details of the policeman and resync the queue
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function edit(req, res) {
  const { id } = req.params;
  const update = await User.update(req.body, { where: { id }});
  
  if(!update && update === 0) {
    return res.status(201).send();
  }
  
  await reSyncPoliceQueue();
  res.status(200).json({ message: 'Updated successfully'});
}

/**
 * This function will remove a policeman from the queue
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
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
