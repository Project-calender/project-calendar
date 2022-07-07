const { createClient } = require('redis')

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}`,
    password: process.env.REDIS_PASSWORD,
})

module.exports = redisClient