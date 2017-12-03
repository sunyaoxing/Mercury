'use strict';
const errorCode = require('../errorCode');

module.exports = controller => logger => (req, res) => {
    if (req.headers['x-request-id']) {
        logger = logger.createLogger({ requestId: req.headers['x-request-id']})
    }
    logger.info('request id found')
    controller(logger)(req, res);
}