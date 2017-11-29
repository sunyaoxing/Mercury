'use strict';

const createModule = model => {
    return Object.assign({},
        require('./common'),
        require('./createApplication')(model),
        require('./authenticateApplication')(model)
    );
}

module.exports = createModule;
