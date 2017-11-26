'use strict';

const common = require('./common');

const findUserById = model => (logger, mercuryId) => {
    return model.user.findById(mercuryId).then(user => {
        if (!user) {
            logger.warn(`user ${mercuryId} not found`);
            return null;
        }

        logger.info(`found user in database ${user.mercuryId}`);
        return common.stripPassword(common.normalize(user));
    }).catch(err => {
        logger.error(`Finding user ${mercuryId} in database failed: ${err.stack}`);
        const error = new Error(`find user ${mercuryId} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const findUserByEmail = model => (logger, email) => {
    return model.user.findOne({ email }).then(user => {
        if (!user) {
            logger.warn(`user ${email} not found`);
            return null;
        }

        return common.stripPassword(common.normalize(user));
    }).catch(err => {
        logger.error(`find user ${email} in database failed: ${err.stack}`);
        const error = new Error(`find user ${email} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const createModule = model => {
    return {
        findUserById: findUserById(model),
        findUserByEmail: findUserByEmail(model),
    }
};

module.exports = createModule;
