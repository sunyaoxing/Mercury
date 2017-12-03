'use strict';

const createDecorators = require('../../../src/apis/decorators/createDecorators');

describe('createDecorators', () => {
    it('should work', () => {
        let mockControllerCalled, dec1Called, dec2Called;
        const mockController = logger => (req, res) => {
            expect(res).toBe('res');
            expect(req).toBe('req');
            mockControllerCalled = true;
        };

        const dec1 = controller => logger => (req, res) => {
            controller(logger)(req, res);
            dec1Called = true;
        };

        const dec2 = controller => logger => (req, res) => {
            controller(logger)(req, res);
            dec2Called = true;
        };

        createDecorators([dec1, dec2])(mockController)('logger')('req', 'res');
        expect(dec1Called).toBe(true)
        expect(dec2Called).toBe(true)
        expect(mockControllerCalled).toBe(true)

    });
});
