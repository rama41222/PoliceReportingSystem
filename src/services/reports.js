const { redisClient } = require('./../lib/bootstrap/database');
const { redisConfig } = require('./../config');
const Report = require('./../modules/reports/model');

/**
 * This function will return the next available report from the redis queue
 * @returns {Promise<*>}
 */
async function getNextPendingReport() {
  return new Promise((resolve, reject) => {
    redisClient.rpop(redisConfig.rQueue, (err, value) => {
      if(err) {
        reject(err.message);
      }
      resolve(value);
    })
  })
}

/**
 * This function will add a report to redis queue
 * @returns {Promise<*>}
 */
async function setReport(id) {
  return new Promise((resolve, reject) => {
    redisClient.rpush([redisConfig.rQueue, id], (err, size) => {
      if(err) {
        reject(err.message);
      }
      resolve(size);
    });
  });
}

/**
 * This function will sync redis queue and database
 * @returns {Promise<*>}
 */
async function reSyncReports() {
  const results = await Report.findAll({ where: { status: 'UNRESOLVED' },  attributes: ['id']});
  const newList = [];
  return new Promise((resolve, reject) => {
    redisClient.del(redisConfig.rQueue);
    newList.unshift(redisConfig.rQueue);
    if(results.length < 1000) {
      results.forEach(r => newList.push(r.id.toString()));
    } else {
      for(let i = 0; i < 1000; i++) {
        if(results[i]) {
          newList.push(results[i].id.toString());
        } else {
          break;
        }
      }
    }
    if(newList.length > 1) {
      redisClient.rpush(newList, (err, data) => {
        if(err) {
          reject(err.message);
        }
        resolve(data);
      })
    } else {
      reject('All reports have been resolved');
    }
  });
}

module.exports = {
  getNextPendingReport,
  setReport,
  reSyncReports
};
