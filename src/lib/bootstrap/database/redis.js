const redis = require('redis');
const { redisConfig } = require('./../../../config');

let redisClient;

async function connectRedis() {
  redisClient = redis.createClient(redisConfig.url);
  
  redisClient.on('connect', function() {
    console.info('Redis client connected');
  });
  
  redisClient.on('error', function (err) {
    console.info('Something went wrong ' + err);
  });
  
  return redisClient;
}

module.exports = {
  connectRedis,
  redisClient
};
