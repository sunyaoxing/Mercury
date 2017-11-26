'use strict';
const { makeUser, createUser, updateUser, findUserById, findUserByEmail, authenticateUser } = require('../../src/core/user.js');
const model = require('../../src/models');
const Logger = require('logger');
const logger = new Logger('SPEC');

describe('core/user', () => {
    describe('makeUser', () => {
        it('should return user', () => {
            const user = makeUser('mercuryId', 'password', 'userEmail', 'displayName');
            expect(user.mercuryId).toBe('mercuryId');
            expect(user.password).toBe('password');
            expect(user.email).toBe('userEmail');
            expect(user.displayName).toBe('displayName');
        });
    });

    describe('createUser', () => {
        it('should create a user in database', done => {
            spyOn(model.user, 'create').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            createUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                other: 'other'
            }).then(result => {
                expect(result).toEqual({
                    mercuryId: 'mercuryId',
                    email: 'userEmail',
                    displayName: 'displayName',
                    createdAt: 'createdAt'
                });
                expect(model.user.create).toHaveBeenCalled();
                done();
            });
        });

        it('should throw ERR_DATABASE if database throws an error', done => {
            spyOn(model.user, 'create').and.returnValue(Promise.reject({}));
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve());
            createUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).catch(err => {console.log(err)
                expect(err.code).toBe('ERR_DATABASE');
                done();
            })
        });

        it('should throw USER_ALREADY_EXIST if database throws an error', done => {
            spyOn(model.user, 'create').and.returnValue(Promise.reject({}));
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            createUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).catch(err => {
                expect(err.code).toBe('USER_ALREADY_EXIST');
                done();
            })
        });
    });

    describe('updateUser', () => {
        it('should create a user in database', done => {
            spyOn(model.user, 'update').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            spyOn(model.user, 'findById').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            updateUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).then(result => {
                expect(result).toEqual({
                    mercuryId: 'mercuryId',
                    email: 'userEmail',
                    displayName: 'displayName',
                    createdAt: 'createdAt'
                });
                expect(model.user.update).toHaveBeenCalled();
                done();
            });
        });

        it('should throw ERR_DATABASE if database throws an error', done => {
            spyOn(model.user, 'update').and.returnValue(Promise.reject({}));
            spyOn(model.user, 'findById').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            updateUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).catch(err => {
                expect(err.code).toBe('ERR_DATABASE');
                done();
            })
        });

        it('should throw USER_NOT_FOUND if database throws an error', done => {
            spyOn(model.user, 'update').and.returnValue(Promise.reject({}));
            spyOn(model.user, 'findById').and.returnValue(Promise.resolve());
            updateUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).catch(err => {
                expect(err.code).toBe('USER_NOT_FOUND');
                done();
            })
        });
    });

    describe('findUserById', () => {
        it('should return the user', done => {
            spyOn(model.user, 'findById').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));

            findUserById(logger, 'mercuryId').then(user => {
                expect(user).toEqual({
                    mercuryId: 'mercuryId',
                    email: 'userEmail',
                    displayName: 'displayName',
                    createdAt: 'createdAt',
                });
                expect(model.user.findById).toHaveBeenCalled();
                done();
            });
        });

        it('should return null if user not found', done => {
            spyOn(model.user, 'findById').and.returnValue(Promise.resolve());

            findUserById(logger, 'mercuryId').then(user => {
                expect(user).toBeNull();
                expect(model.user.findById).toHaveBeenCalled();
                done();
            });
        });

        it('should throw ERR_DATABASE if database throws an error', done => {
            spyOn(model.user, 'findById').and.returnValue(Promise.reject({}));
            findUserById(logger, 'mercuryId').catch(err => {
                expect(err.code).toBe('ERR_DATABASE');
                done();
            })
        });
    });

    describe('findUserByEmail', () => {
        it('should return the user', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));

            findUserByEmail(logger, 'userEmail').then(user => {
                expect(user).toEqual({
                    mercuryId: 'mercuryId',
                    email: 'userEmail',
                    displayName: 'displayName',
                    createdAt: 'createdAt'
                });
                expect(model.user.findOne).toHaveBeenCalled();
                done();
            });
        });

        it('should return null if user not found', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve());

            findUserByEmail(logger, 'userEmail').then(user => {
                expect(user).toBeNull();
                expect(model.user.findOne).toHaveBeenCalled();
                done();
            });
        });

        it('should throw ERR_DATABASE if database throws an error', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.reject({}));
            findUserByEmail(logger, 'userEmail').catch(err => {
                expect(err.code).toBe('ERR_DATABASE');
                done();
            })
        });
    });

    describe('authenticateUser', () => {
        it('should return user if password matchs', done => {
            spyOn(model.user, 'create').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }));
            createUser(logger, {
                mercuryId: 'mercuryId',
                password: 'password',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other'
            }).then(user => {
                const created = model.user.create.calls.argsFor(0)[0];
                spyOn(model.user, 'findOne').and.returnValue(Promise.resolve(created));
                authenticateUser(logger, 'userEmail', 'password').then(result => {
                    expect(result.mercuryId).toEqual(user.mercuryId);
                    done();
                })
            });
        });

        it('should return null if user not found', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve());
            authenticateUser(logger, 'userEmail', 'password').then(result => {
                expect(result).toBeNull();
                done();
            })
        });

        it('should return null if password not match not found', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.resolve({
                mercuryId: 'mercuryId',
                password: '****************',
                email: 'userEmail',
                displayName: 'displayName',
                createdAt: 'createdAt',
                other: 'other',
            }));
            authenticateUser(logger, 'userEmail', 'password').then(result => {
                expect(result).toBeNull();
                done();
            });
        });

        it('should throw ERR_DATABASE if database throws an error', done => {
            spyOn(model.user, 'findOne').and.returnValue(Promise.reject({}));
            authenticateUser(logger, 'userEmail', 'password').catch(err => {
                expect(err.code).toBe('ERR_DATABASE');
                done();
            })
        });
    });
});