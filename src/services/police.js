const { redisClient } = require('./../lib/bootstrap/database');
const { redisConfig } = require('./../config');
const User = require('./../modules/users/model');

async function getNextAvailablePoliceman() {
  return new Promise((resolve, reject) => {
    redisClient.rpop(redisConfig.pQueue, (err, value) => {
      if(err) {
        reject(err.message);
      }
      resolve(value);
    })
  })
}

async function setPoliceman(id) {
   return new Promise((resolve, reject) => {
     redisClient.rpush([redisConfig.pQueue, id], (err, size) => {
       if(err) {
         reject(err.message);
       }
       resolve(size);
     });
   });
}

async function reSyncPoliceQueue() {
  const results = await User.findAll({ where: { is_occupied: false },  attributes: ['id']});
  const newList = [];
  return new Promise((resolve, reject) => {
    redisClient.del(redisConfig.pQueue);
    newList.unshift(redisConfig.pQueue);
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
      reject('Police officers are not available');
    }
  });
}
reSyncPoliceQueue();

module.exports = {
  getNextAvailablePoliceman,
  setPoliceman,
  reSyncPoliceQueue
};

