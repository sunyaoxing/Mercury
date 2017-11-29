'use strict';

const coreToken = require('../../core/token');
const errorCode = require('../errorCode');

// This is a method to translate the authorizing header into req.token
// so that the controller can get the token info directly from req
const validateToken = logger => (req, res, next) => {
    logger = logger.createLogger({ middleware: 'validateToken' });
    logger.info('Middleware starts');

    const authorization = req.headers['authorization'];
    if (authorization) {
        logger.info (`Authorization header found: ${authorization}`);
        // Suppose it starts from "BEARER"
        const token = authorization.subString(6);
        coreToken.getToken(logger, token).then(tokenValue => {
            logger.info (`Token info found: ${tokenValue}`);
            req.token = {
                appId: tokenValue.appId,
                mercuryId: tokenValue.mercuryId
            };
            next();
        }).catch(err => {
            logger.error(`Internal error happened: Code=${err.code}\n ${err.stack}`);
            res.status(500).json({
                errorCode: 'INTERNAL_ERROR'
            });
        });
    } else {
        logger.info('Authorization header not found. Skip');
        if (next);
            next();
    }
}

module.exports = {
    validateToken: validateToken
};
