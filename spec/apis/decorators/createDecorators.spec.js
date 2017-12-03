'use strict';

const createDecorators = require('../../../src/apis/decorators/createDecorators');

describe('createDecorators', () => {
    it('should work', () => {
        let dec1Called, dec2Called;

        let mockController = jasmine.createSpy();
        const controller = logger => mockController;

        const dec1 = controller => logger => (req, res) => {
            controller(logger)(req, res);
            dec1Called = true;
        };

        const dec2 = controller => logger => (req, res) => {
            controller(logger)(req, res);
            dec2Called = true;
        };

        createDecorators([dec1, dec2])(controller)('logger')('req', 'res');
        expect(dec1Called).toBe(true)
        expect(dec2Called).toBe(true)
        expect(mockController).toHaveBeenCalledWith('req', 'res');

    });
});
