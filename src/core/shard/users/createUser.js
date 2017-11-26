'use strict';

const { generateMercuryId, hashPassword, normalize, stripPassword } = require('./common');

const createUser = model => (logger, user) => {
    const { findUserByEmail } = require('./queryUsers')(model);

    if (!user.mercuryId) {
        user = Object.assign(user, { mercuryId: generateMercuryId() });
    }

    user = Object.assign(user, { createdAt: new Date() });
    user = Object.assign(user, { password: hashPassword(user, user.password) });
    return model.user.create(normalize(user)).then(user => {
        logger.info(`create user ${user.email} in database success`);
        return stripPassword(normalize(user));
    }).catch(err => {
        logger.info(`create user ${user.email} in database failed: ${err.stack}`);
        logger.info('Check if the user already exist');
        return findUserByEmail(logger, user.email).then(_user => {
            if (_user) {
                logger.info('User already exist');
                const error = new Error(`User ${user.email} already exist`);
                error.code = "USER_ALREADY_EXIST";
                throw error;
            } else {
                logger.info('Must be database error');
                const error = new Error(`Create user ${user.email} in database failed: ${err.stack}`);
                error.code = "ERR_DATABASE";
                throw error;
            }
        });
    });
}

const createModule = model => {
    return {
        createUser: createUser(model)
    }
};

module.exports = createModule;
