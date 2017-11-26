'use strict';
const user = require('./user');

module.exports = (logger, app) => {
    logger.info('CREATE ROUTES');

    app.post('/api/v1/users', user.createUser(logger));
    app.post('/api/v1/users/:mercuryId', user.updateUser(logger));
};
