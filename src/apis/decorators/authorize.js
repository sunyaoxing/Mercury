'use strict';
const errorCode = require('../errorCode');

module.exports = controller => logger => (req, res) => {
    logger.createLogger({ controllerDecorator: 'authorize'});
    if (req.token === undefined) {
        // Token  is not provided; we return 401
        logger.error('token not provided');
        res.status(401).json({
            code: errorCode.ERR_INVALID_TOKEN
        });
    }
    if (req.token === null) {
        // Token provied but not valid, we return 403
        // Token  is not provided; we return 401
        logger.error('token not valid');
        res.status(403).json({
            code: errorCode.ERR_INVALID_TOKEN
        });
    } else {
        logger.error('token provided');
        controller(logger)(req, res);
    }
}