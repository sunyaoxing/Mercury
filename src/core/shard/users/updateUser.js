'use strict';

const { generateMercuryId, hashPassword, normalize, stripPassword, stripEmail} = require('./common');

const updateUser = model => (logger, user) => {
    const { findUserById } = require('./queryUsers')(model);

    user = normalize(user);
    user = stripEmail(user); // email identifies a user, thus can't be changed

    logger.info('Read existing user from database');
    return findUserById(logger, user.mercuryId).then(_user => {
        // Ineed createdAt and email for hashing password
        user = Object.assign({}, user, {
            createdAt: _user.createdAt,
            email: _user.email
        });
        // if the password is updated, need to hash the password
        if (user.password) {
           user = Object.assign(user, { password: hashPassword(user, user.password) });
        }
        logger.info('Update user info database');
        return model.user.update(user, {
            where: {
                mercuryId: user.mercuryId
            }
        })
    }).then(() => {
        logger.info(`update user ${user.id} in database success`);

        return findUserById(logger, user.mercuryId);
    }).catch(err => {
        return findUserById(logger, user.mercuryId).then(_user => {
            if (!_user) {
                logger.info('User not found');
                const error = new Error(`User ${user.mercuryId} already exist`);
                error.code = "USER_NOT_FOUND";
                throw error;
            } else {
                logger.info('Must be database error');
                const error = new Error(`Update user ${user.mercuryId} in database failed: ${err.stack}`);
                error.code = "ERR_DATABASE";
                throw error;
            }
        });
    });
}

const createModule = model => {
    return {
        updateUser: updateUser(model)
    }
};

module.exports = createModule;
