'use strict';

const crypto = require('crypto');
const model = require('../models');
const uuidV4 = require('uuid/v4');

const SALT = 'FUCK';

const generateMercuryId = () => {
    return uuidV4();
}

const makeUser = (mercuryId, password, email, displayName) => {
    return {
        mercuryId,
        password,
        email,
        displayName
    };
}

const normalize = user => {
    return {
        mercuryId: user.mercuryId,
        password: user.password,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt
    };
}

const stripPassword = user => {
    user = Object.assign({}, user, { password: undefined });
    delete user.password;
    return user;
}

const stripEmail = user => {
    user = Object.assign({}, user, { email: undefined });
    delete user.email;
    return user;
}


const hashPassword = (user, password) => {
    const hash = crypto.createHash('sha256');

    // add salt
    const saltedPassword = SALT + (user.createdAt.toString()) + (user.email) + password;
    hash.update(saltedPassword);
    return hash.digest('hex');
};

const createUser = (logger, user) => {
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

const updateUser = (logger, user) => {
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

const findUserById = (logger, mercuryId) => {
    return model.user.findById(mercuryId).then(user => {
        if (!user) {
            logger.warn(`user ${mercuryId} not found`);
            return null;
        }

        logger.info(`found user in database ${user.mercuryId}`);
        return stripPassword(normalize(user));
    }).catch(err => {
        logger.error(`Finding user ${mercuryId} in database failed: ${err.stack}`);
        const error = new Error(`find user ${mercuryId} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const findUserByEmail = (logger, email) => {
    return model.user.findOne({ email }).then(user => {
        if (!user) {
            logger.warn(`user ${email} not found`);
            return null;
        }

        return stripPassword(normalize(user));
    }).catch(err => {
        logger.error(`find user ${email} in database failed: ${err.stack}`);
        const error = new Error(`find user ${email} in database failed: ${err.stack}`);
        error.code = "ERR_DATABASE";
        throw error;
    });
}

const authenticateUser = (logger, email, password) => {
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

module.exports = {
    makeUser,
    createUser,
    updateUser,
    findUserById,
    findUserByEmail,
    authenticateUser
};
