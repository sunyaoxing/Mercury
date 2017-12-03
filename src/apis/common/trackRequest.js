'use strict'

module.exports = (logger, req) => {
    if (req.headers['x-request-id']) {
        logger = logger.createLogger({ requestId: req.headers['x-request-id'] });
    }
    return logger;
}