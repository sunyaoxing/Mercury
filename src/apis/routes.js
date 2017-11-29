'use strict';
const user = require('./user');
const application = require('./application');
const authentication = require('./authentication');

const middlewares = require('./middlewares');

module.exports = (logger, app) => {
    logger.info('CREATE ROUTES');
console.log(middlewares)
    app.use(middlewares.validateToken(logger));

    app.post('/api/v1/users', user.createUser(logger));
    app.post('/api/v1/users/:mercuryId', user.updateUser(logger));


    app.post('/api/v1/applications', application.createApplication(logger));


    app.post('/api/v1/authenticate', authentication.authenticate(logger));
};
