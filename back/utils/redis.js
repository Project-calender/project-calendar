const { createClient } = require('ioredis')

const redisClient = createClient({
    lazyConnect: true,
    url: `redis://${process.env.REDIS_HOST}`,
    password: process.env.REDIS_PASSWORD,
    port : 6379
})

module.exports = redisClient