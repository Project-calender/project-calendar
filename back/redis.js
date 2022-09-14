const { createClient } = require("redis");

const redisClient = createClient();

const startRedis = async function () {
  await redisClient.connect();
};

module.exports = {
  redisClient: redisClient,
  startRedis: startRedis,
};
