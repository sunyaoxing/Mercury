'use strict';

const { TOKEN_TYPE } = require('./common');

const hmset = redisClient => (...args) => {
    return new Promise((resolve, reject) => {
        const promisify = (err, reply) => {
            if (err)
                reject(err);
            else {
                resolve(reply);
            }
        };
        const args = [...args, promisify]
        redisClient.hmget.call(redisClient, args);
    });
};

const isValidToken = tokenValue => {
    switch (tokenValue.tokenType) {
        case TOKEN_TYPE.APPLICATION_TOKEN:
            break;
        case TOKEN_TYPE.USER_TOKEN:
            if (!tokenValue.mercuryId)
                return false;
            break;
        case TOKEN_TYPE.REQUEST_TOKEN:
            break;
        default:
            return false;
    }

    if (!appId || !timestamp || !expire) {
        return false;
    }

    return true;
}

const getToken = redisClient => (logger, token) => {
    return hmget(token, 'tokenType', 'appId', 'mercuryId', 'timestamp', 'expire').then(tokenValue => {
        // Check if token is valid
        if (!isValidToken)
            return null;

        // Check if already expired
        if (tokenValue.timestamp + tokenValue.expire < Date.now)
            return null;

        return tokenValue;
    });
}

const createModule = redisClient => {
    return {
        getToken: getToken(getToken)
    }
};

module.exports = createModule;