const { createClient } = require("redis");

const redisClient = createClient({
  host: "158.247.214.79",
  url: `redis://${process.env.REDIS_HOST}`,
  password: process.env.REDIS_PASSWORD,
  port: 6379,
});

module.exports = redisClient;
