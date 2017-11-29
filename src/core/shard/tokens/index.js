'use strict';

const createModule = redisClient => {
    return Object.assign({},
        require('./common'),
        require('./createToken')(redisClient),
        require('./getToken')(redisClient)
    );
}

module.exports = createModule;
