const Report = require('./model');
const User = require('./../users/model');
const { getNextAvailablePoliceman, setPoliceman, reSyncPoliceQueue } = require('./../../services/police');
const { setReport, getNextPendingReport, reSyncReports } = require('./../../services/reports');

/**
 * This function will list down all the reports
 * It accepts query param status which can be PENDING, RESOLVED or UNRESOLVED
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function list(req, res) {
  
  const status = req.query.status;
  const options = {};
  options.limit = parseInt(req.query.limit,10) || 100;
  options.skip = parseInt(req.query.skip,10) || 0;
  
  if(status) {
    options.where = { status };
  }
  
  const reports = await Report.findAll(options).catch(e => (res.status(400).json({ message: 'Database error'})));
  res.status(200).json({ reports });
}

/**
 * This function will list down one report
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function listOne(req, res) {
  const { id } = req.params;
  const report = await Report.findAll({ where: { id }});
  res.status(200).json({ report });
}

/**
 * This function will create a report
 * Assign the report to a policeman
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function create(req, res) {
  // Create a new report
  const report = new Report(req.body);
  try {
    
    // Get the next available police person from queue
    const id = await getNextAvailablePoliceman().catch(console.error);
  
    if (!id) {
      // if there's no policeman available, report will be just saved and enqueued into unresolved reports queue
      const unassignedReport = await report.save();
      await setReport(unassignedReport.id);
      return res.status(200).json({ report: unassignedReport, message: 'Currently all officers are occupied, your query will be attended shortly!' });
    }
  
    // else report is assigned to a police officer
    report.assignee_id = id;
    report.status = 'PENDING';
    const saveReport = await report.save();
    const policeOfficer = await User.update({ is_occupied: true },{ where: { id }});
  
    if (!saveReport || !policeOfficer) {
      return res.status(400).json({ message: 'Data saving error'});
    }
  
    res.status(200).json({ report: saveReport, policeOfficer, message: 'Report has been assigned!'});
  } catch (e) {
    res.status(400).send(e.message);
  }
}

/**
 * This function will edit a report
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function edit(req, res) {
  const { id } = req.params;
  const update = await Report.update(req.body, { where: { id }});
  
  if(!update && update === 0) {
    return res.status(201).send();
  }
  
  await reSyncPoliceQueue();
  res.status(200).json({ message: 'Updated successfully'});
}

/**
 * This function is used to resolve a case filed
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function resolve(req, res) {
  
  try {
    
    const { id } = req.params;
    const report = await Report.findOne({ where: { id, status: 'PENDING'}});
  
    if(!report) {
      return res.status(201).json({ message: 'Cannot resolve the report'});
    }
  
    await Report.update({ status: 'RESOLVED' },{ where: { id }});
    const nextUnResolvedReport = await getNextPendingReport();
   
    if(nextUnResolvedReport) {
      await Report.update({ assignee_id: report.assignee_id, status: 'PENDING' },{ where: { id: nextUnResolvedReport }});
      return res.status(200).json({ message: 'Report has been resolved!'})
    }
  
    await User.update({ is_occupied: false },{ where: { id: report.assignee_id }});
    await setPoliceman(report.assignee_id);
    res.status(200).json({ report, message: 'Report has been resolved' });
  } catch (e) {
    res.status(400).send(e.message);
  }
}

/**
 * This function is used to remove a report
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function remove(req, res) {
  const { id } = req.params;
  await Report.remove({ where: { id }});
  await reSyncReports();
  res.status(200).send();
}

module.exports = {
  list,
  listOne,
  create,
  edit,
  remove,
  resolve
};
