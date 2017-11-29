'use strict';
const { createToken, TOKEN_TYPE } = require('./common');



const setTTL = redisClient => (...args) => {
    return new Promise((resolve, reject) => {
        const promisify = (err, reply) => {
            if (err)
                reject(err);
            else {
                resolve(reply);
            }
        };
        args = [...args, promisify]
        try {
            redisClient.expire.apply(redisClient, args);
        } catch (err) {
            reject(err);
        }
    });
}

const hmset = redisClient => (...args) => {
    return new Promise((resolve, reject) => {
        const promisify = (err, reply) => {
            if (err)
                reject(err);
            else {
                resolve(reply);
            }
        };
        args = [...args, promisify];
        try {
            redisClient.hmset.apply(redisClient, args);
        } catch (err) {
            reject(err);
        }
    });
}

const createApplicationToken = redisClient => (logger, appId) => {
    logger.info('[createApplicationToken] starts');
    const token = createToken();
    return hmset(redisClient)(token,
        'tokenType', TOKEN_TYPE.APPLICATION_TOKEN,
        'appId', appId,
        'timestamp', Date.now(),
        'expire', 3600).then(reply => {
        logger.info('[createApplicationToken] token stored in redis')
        return setTTL(redisClient)(token, 3600);
    }).then(reply => {
        logger.info('[createApplicationToken] token expire set in redis')
        return {
            token,
            expire: 3600
        };
    }).catch(err => {
        logger.error('[createApplicationToken] Storing token in redis failed');
        const error = new Error(`[createApplicationToken] Storing token in redis failed: ${err.stack}`);
        error.code = "ERR_REDIS";
        throw error;
    });
}

const createUserToken = redisClient => (logger, appId, mercuryId) => {
    logger.info('[createUserToken] starts');
    const token = createToken();
    const now = new Date();
    return hmset(redisClient)(token,
        'tokenType', TOKEN_TYPE.USER_TOKEN,
        'appId', appId,
        'mercuryId', mercuryId,
        'timestamp', now,
        'expire', 86400).then(reply => {
        logger.info('[createUserToken] token stored in redis')
        return setTTl(redisClient)(token, 86400);
    }).then(reply => {
        logger.info('[createUserToken] token expire set in redis')
        return token;
    }).catch(err => {
        logger.error('[createUserToken] Storing token in redis failed');
        const error = new Error(`[createUserToken] Storing token in redis failed: ${err.stack}`);
        error.code = "ERR_REDIS";
        throw error;
    });
}

const createRequestToken = redisClient => (logger, appId) => {
    logger.info('[createRequestToken] starts');
    const token = createToken();
    const now = new Date();
    return hmset(redisClient)(token,
        'tokenType', TOKEN_TYPE.REQUEST_TOKEN,
        'appId', appId,
        'timestamp', now,
        'expire', 86400).then(reply => {
        logger.info('[createRequestToken] token stored in redis')
        return setTTl(redisClient)(token, 60);
    }).then(reply => {
        logger.info('[createRequestToken] token expire set in redis')
        return token;
    }).catch(err => {
        logger.error('[createRequestToken] Storing token in redis failed');
        const error = new Error(`[createRequestToken] Storing token in redis failed: ${err.stack}`);
        error.code = "ERR_REDIS";
        throw error;
    });
}

const createModule = redisClient => {
    return {
        createApplicationToken: createApplicationToken(redisClient),
        createUserToken: createUserToken(redisClient),
        createRequestToken: createRequestToken(redisClient)
    }
};

module.exports = createModule;
