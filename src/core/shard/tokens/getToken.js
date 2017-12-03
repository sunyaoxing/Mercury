'use strict';

const { TOKEN_TYPE } = require('./common');

const hmget = redisClient => (...args) => {
    return new Promise((resolve, reject) => {
        const promisify = (err, reply) => {
            if (err)
                reject(err);
            else {
                resolve(reply);
            }
        };
        args = [...args, promisify]
        redisClient.hmget.apply(redisClient, args);
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

    if (!tokenValue.appId || !tokenValue.timestamp || !tokenValue.expire) {
        return false;
    }

    return true;
}

const getToken = redisClient => (logger, token) => {
    return hmget(redisClient)(token, 'tokenType', 'appId', 'mercuryId', 'timestamp', 'expire').then(tokenValue => {
        tokenValue = {
            tokenType: tokenValue[0],
            appId: tokenValue[1],
            mercuryId: tokenValue[2],
            timestamp: tokenValue[3],
            expire: tokenValue[4]
        };

        // Check if token is valid
        if (!isValidToken(tokenValue))
            return null;

        // Check if already expired
        if (tokenValue.timestamp + tokenValue.expire < Date.now()) {
            return null;
        }

        return tokenValue;
    });
}

const createModule = redisClient => {
    return {
        getToken: getToken(redisClient)
    }
};

module.exports = createModule;