'user strict';

const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const generateAppId = () => {
    return uuidV4();
};

const generateSecret = () => {
    return crypto.createHash('sha256').update(uuidV4()).digest('hex').toUpperCase();
};

const normalize = application => {
    return {
        appId: application.appId,
        secret: application.secret,
        owner: application.owner,
        name: application.name,
        description: application.description,
        gatewaySecret: application.gatewaySecret
    }
}

module.exports = {
    generateAppId,
    generateSecret,
    normalize
};
