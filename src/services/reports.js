const { redisClient } = require('./../lib/bootstrap/database');
const { redisConfig } = require('./../config');
const Report = require('./../modules/reports/model');


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
      reject('All reports are resolved');
    }
  });
}

reSyncReports();

module.exports = {
  getNextPendingReport,
  setReport,
  reSyncReports
};
