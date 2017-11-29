'use strict';

const { generateAppId, generateSecret, normalize } = require('./common');

/**
 * @function authenticateApplication
 * Validate whether application id and secret matchs
 *
 * @param   {Logger}    The logger utility
 * @appId   {Object}    The application id
 * @secret  {String}    The secret

 * @return  {Boolean}   ture if the appId and secret checks out
 */
const authenticateApplication = model => (logger, appId, secret) => {

    return model.application.findOne({
        where: {
            appId,
            secret
        }
    }).then(application => {
        if (!application) {
            logger.warn(`Application authenticate fails! appId: ${appId}`);
            return false;
        }
        logger.info(`Application authenticate success! appId: ${appId}`);
        return true;
    }).catch(err => {
        logger.info(`Authenticate application ${appId} in database failed: ${err.stack}`);
        logger.info('Must be database error');
        const error = new Error(`Authenticate application ${appId} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const createModule = model => {
    return {
        authenticateApplication: authenticateApplication(model)
    }
};

module.exports = createModule;
