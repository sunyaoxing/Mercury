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
        if (req.headers['x-token']) {
            const token = JSON.stringify('x-token');
            if (token.appId & token.mercuryId) {
                // TODO: validate gateway secret
                req.token = {
                    appId: token.appId,
                    mercuryId: token.mercuryId
                };
            } else {
                // Make it bad request
                logger.error(`Internal error happened: Code=${err.code}\n ${err.stack}`);
                res.status(500).json({
                    errorCode: errorCode.ERR_INVALID_TOKEN
                });
            }
            next();
        }
    } else {
        logger.info('Authorization header not found. Skip');
        next()
    }
}

module.exports = {
    validateToken: validateToken
};
