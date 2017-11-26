'use strict';

const { generateAppId, generateSecret, normalize } = require('./common');

/**
 * @function CreateApplication
 * Create a new Application
 *
 * @param {Logger} the logger utility
 * @application                 {Object}    The application to create
 * @application.owner           {String}    The mercuryId of the owner of the application
 * @application.name            {String}    The name of the application
 * @application.description     {String}    The description of the application
 */
const createApplication = model => (logger, application) => {
    // Generate an application id to create
    application = Object.assign({}, application, {
        appId: generateAppId(),
        secret: generateSecret(),
        gatewaySecret: generateSecret()
    });

    return model.application.create(normalize(application)).then(application => {
        logger.info(`created application in database success. appId: ${application.appId}, name: ${application.name}, owner: ${application.owner}`);
        return normalize(application);
    }).catch(err => {
        logger.info(`create application in database failed: ${err.stack}`);
        logger.info('Must be database error');
        const error = new Error(`Create application in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const createModule = model => {
    return {
        createApplication: createApplication(model)
    }
};

module.exports = createModule;
