'use strict';
const user = require('./user');
const application = require('./application');
const authentication = require('./authentication');

const middlewares = require('./middlewares');


// for decorators
const createDecorators = require('./decorators/createDecorators');
const requestId = require('./decorators/requestId');
const authorize = require('./decorators/authorize');


module.exports = (logger, app) => {
    logger.info('Initializing middlewares');
    app.use(middlewares.validateToken(logger));

    logger.info('CREATE ROUTES');

    app.post('/api/v1/users', user.createUser(logger));
    app.post('/api/v1/users/:mercuryId', user.updateUser(logger));


    app.post('/api/v1/applications', application.createApplication(logger));


    app.post('/api/v1/authenticate', createDecorators([requestId])(authentication.authenticate)(logger));
};
