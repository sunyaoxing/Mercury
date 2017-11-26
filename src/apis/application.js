'use strict';
const assert = require('assert');
const coreApplication = require('../core/application');

/**
 * @function _validateCreateApplicationPayload
 * Validate the parameter to create an application
 *
 * @returns {Object} application
 *          {String} application.name
 *          {String} application.owner
 *          {String} application.description
 */
const _validateCreateApplicationPayload = (logger, req) => {
    const payload = req.body;
    try {
        assert(payload);
        assert(payload.name);
        assert(payload.owner);
        assert(payload.description);
        return {
            name: payload.name,
            owner: payload.owner,
            description: payload.description
        };
    } catch (err) {
        logger.warn(`Payload is not valid: ${err.stack}`);
        const error = new Error(`Payload is not valid`);
        error.code = "ERR_PAYLOAD_FORMAT";
        throw error;
    }
}

const createApplication = logger => (req, res) => {
    const startTime = new Date();
    logger = logger.createLogger({ controller: 'createApplication' });
    logger.info('Controller Starts');

    let user;
    Promise.resolve().then(() => {
        const application = _validateCreateApplicationPayload(logger, req);
        return coreApplication.createApplication(logger, application);
    }).then(application =>{
        logger.info(`Application created.`);
        res.status(201).json(application);

        const duration = new Date() - startTime;
        logger.info(`Controller Ends. duration=${duration}`);
    }).catch (err => {
        logger.warn(`Error happened: ${err.code}, ${err.stack}`);
        let status = 500;
        let errorCode = 'INTERNAL_ERROR';
        switch (err.code) {
            case 'ERR_PAYLOAD_FORMAT':
                status = 400;
                errorCode = err.code;
                break;
            default:
                break;
        }
        res.status(status).json({ errorCode });

        const duration = new Date() - startTime;
        logger.info(`Controller Ends. duration=${duration}`);
    });
};


module.exports = {
    createApplication
};
