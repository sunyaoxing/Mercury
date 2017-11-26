'use strict';
const model = require('../models');

// TODO: We will get a list of models and create shards from the model list
// sharding will then be done here.

module.exports = require('./shard/applications')(model);

