'use strict';
const redis = require('redis');
const redisClient = redis.createClient({
    host: "127.0.0.1",
    port: 6379
});

// TODO: We will get a list of models and create shards from the model list
// sharding will then be done here.

module.exports = require('./shard/tokens')(redisClient);