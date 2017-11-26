'use strict';

const { generateMercuryId, hashPassword, normalize, stripPassword } = require('./common');

const authenticateUser = model => (logger, email, password) => {
    return model.user.findOne({ email }).then(user => {
        if (!user) {
            logger.warn(`user ${email} not found`);
            return null;
        }

        if (hashPassword(user, password) === user.password) {
            return stripPassword(user);
        } else {
            return null;
        }
    }).catch(err => {
        logger.error(`find user ${email} in database failed: ${err.stack}`);
        const error = new Error(`find user ${email} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const createModule = model => {
    return {
        authenticateUser: authenticateUser(model)
    }
};

module.exports = createModule;