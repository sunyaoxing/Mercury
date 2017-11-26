'user strict';

const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const SALT = 'FUCK';

const generateMercuryId = () => {
    return uuidV4();
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

module.exports = {
    generateMercuryId,
    normalize,
    stripPassword,
    stripEmail,
    hashPassword
};
