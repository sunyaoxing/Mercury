'use strict';

const createDecorators = decorators => controller => {
	const dec = decorators.pop(); console.log(dec, controller)
	controller = dec(controller);
	if (decorators.length === 0) {
		return controller;
	} else {
		return createDecorators(decorators)(controller);	
	}
}

module.exports = createDecorators;
