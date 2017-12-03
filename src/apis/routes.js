'use strict';
const user = require('./user');
const application = require('./application');
const authentication = require('./authentication');

const middlewares = require('./middlewares');


// for decorators
//const createDecorators = require('./decorators/createDecorators');
//const requestId = require('./decorators/requestId');


module.exports = (logger, app) => {
    logger.info('Initializing middlewares');
    //app.use(middlewares.validateToken(logger));

    logger.info('CREATE ROUTES');

    app.post('/api/v1/users', middlewares.validateToken(logger),  user.createUser(logger));
    app.post('/api/v1/users/:mercuryId', middlewares.validateToken(logger),  user.updateUser(logger));


    app.post('/api/v1/applications', middlewares.validateToken(logger), application.createApplication(logger));


    app.post('/api/v1/authenticate', authentication.authenticate(logger));
};
