'use strict';

const createModule = model => {
    return Object.assign({},
        require('./makeUser'),
        require('./common'),
        require('./createUser')(model),
        require('./updateUser')(model),
        require('./queryUsers')(model),
        require('./authenticateUser')(model)
    );
}

module.exports = createModule;
