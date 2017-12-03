'use strict';
const assert = require('assert');
const coreApplication = require('../core/application');
const coreToken = require('../core/token');

const { trackRequest } = require('./common');


const _validateAuthenticationHeader = (logger, req) => {console.log(req.body)
    const payload = req.body;
    try {
        assert(payload);
        assert(payload.appId);
        assert(payload.secret);
        return {
            appId: payload.appId,
            secret: payload.secret
        }
    } catch (err) {
        logger.warn(`Payload is not valid: ${err.stack}`);
        const error = new Error(`Payload is not valid`);
        error.code = "ERR_PAYLOAD_FORMAT";
        throw error;
    };
}

const authenticate = logger => (req, res) => {
    logger = trackRequest(logger, req);

    const startTime = new Date();


    logger = logger.createLogger({ controller: 'authorization' });
    logger.info('Controller Starts');

    let credential;
    Promise.resolve().then(() => {
        credential = _validateAuthenticationHeader(logger, req);
        return coreApplication.authenticateApplication(logger, credential.appId, credential.secret);
    }).then(result => {
        if (result) {
            logger.info(`Application authenticated`);
            return coreToken.createApplicationToken(logger, credential.appId).then(token => {
                res.status(200).json(token);
            })
        } else {
            // authenticate failed, return 401
            res.status(401).json({
                errorCode: 'INVALID_CREDENTIAL'
            });
            return;
        }
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

    }).then(() => {
        const duration = new Date() - startTime;
        logger.info(`Controller Ends. duration=${duration}`);
    });
}

module.exports = {
    authenticate
};

