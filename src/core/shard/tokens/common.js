'use strict';

const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const TOKEN_TYPE = {
    APPLICATION_TOKEN: 'APPLICATION_TOKEN',
    USER_TOKEN: 'USER_TOKEN',
    REQUEST_TOKEN: 'REQUEST_TOKEN'
};

const createToken = () => {
    return crypto.createHash('sha256').update(uuidV4()).digest('hex').toUpperCase();
};

module.exports = {
    TOKEN_TYPE,
    createToken
};
