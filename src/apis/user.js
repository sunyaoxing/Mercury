'use strict';
const assert = require('assert');
const coreUser = require('../core/user');

const _validateCreateUserPayload = (logger, req) => {
    const payload = req.body;
    try {
        assert(payload);
        assert(payload.email);
        assert(payload.password);
        assert(payload.displayName);
        return payload;
    } catch (err) {
        logger.warn(`Payload is not valid: ${err.stack}`);
        const error = new Error(`Payload is not valid`);
        error.code = "ERR_PAYLOAD_FORMAT";
        throw error;
    }
}

const createUser = logger => (req, res) => {
    const startTime = new Date();
    logger = logger.createLogger({ controller: 'createUser' });
    logger.info('Controller starts');

    let user;
    Promise.resolve().then(() => {
        const user = _validateCreateUserPayload(logger, req);
        const { email, password, displayName } = user;
        return coreUser.createUser(logger, coreUser.makeUser(null, password, email, displayName));

    }).then(user =>{
        logger.info(`User created: ${JSON.stringify(user)}`);
        res.status(201).json(user);

        const duration = new Date() - startTime;
        logger.info(`duration=${duration}`);
    }).catch (err => {
        logger.warn(`Error happened: ${err.code}, ${err.stack}`);
        let status = 500;
        let errorCode = 'INTERNAL_ERROR';
        switch (err.code) {
            case 'ERR_PAYLOAD_FORMAT':
                status = 400;
                errorCode = err.code;
            case 'USER_ALREADY_EXIST':
                status = 409;
                errorCode = err.code;
            default:
        }
        res.status(status).json({ errorCode });

        const duration = new Date() - startTime;
        logger.info(`duration=${duration}`);
    });
};


const _validateUpdateUserPayload = (logger, req) => {
    const mercuryId = req.params['mercuryId'];
    const payload = req.body;
    try {
        assert(mercuryId);
        assert(payload);
        assert(payload.password);
        assert(payload.displayName);
        return coreUser.makeUser(mercuryId, payload.password, null, payload.displayName)
    } catch (err) {
        logger.warn(`Payload is not valid: ${err.stack}`);
        const error = new Error(`Payload is not valid`);
        error.code = "ERR_PAYLOAD_FORMAT";
        throw error;
    }
}

const updateUser = logger => (req, res) => {
    const startTime = new Date();
    logger = logger.createLogger({ controller: 'createUser' });
    logger.info('Controller starts');

    let user;
    Promise.resolve().then(() => {
        const user = _validateUpdateUserPayload(logger, req);
        return coreUser.updateUser(logger, user);
    }).then(user =>{
        logger.info(`User updated: ${JSON.stringify(user)}`);
        res.status(200).json(user);

        const duration = new Date() - startTime;
        logger.info(`duration=${duration}`);
    }).catch (err => {
        logger.warn(`Error happened: ${err.code}, ${err.stack}`);
        let status = 500;
        let errorCode = 'INTERNAL_ERROR';
        switch (err.code) {
            case 'ERR_PAYLOAD_FORMAT':
                status = 400;
                errorCode = err.code;
            case 'USER_NOT_FOUND':
                status = 404;
                errorCode = err.code;
            default:
        }
        res.status(status).json({ errorCode });

        const duration = new Date() - startTime;
        logger.info(`duration=${duration}`);
    });
};


module.exports = {
    createUser,
    updateUser
};
