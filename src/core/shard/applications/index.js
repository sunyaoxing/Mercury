'use strict';

const createModule = model => {
    return Object.assign({},
        require('./common'),
        require('./createApplication')(model)
    );
}

module.exports = createModule;
