// tests/unit/services/auth/Attempts.test.js
import test from 'ava';
import sinon from 'sinon';
import { Attempts } from '../../../../services/auth/Attempts.js';
import { connectToMongoMemoryServer, disconnectFromMongoMemoryServer } from '../../../helpers/mongoMemoryServer.js';

let attempts;
let sandbox;

test.before(async () => {
    await connectToMongoMemoryServer();
});

test.after.always(async () => {
    await disconnectFromMongoMemoryServer();
});

test.beforeEach(() => {
    sandbox = sinon.createSandbox();

    const mockLoginAttempts = {
        findOne: sandbox.stub().resolves(null),
        deleteOne: sandbox.stub().resolves(),
        create: sandbox.stub().resolves({}),
        save: sandbox.stub().resolves()
    };

    const mockAllowed = {
        findOne: sandbox.stub().resolves(null)
    };

    const mockConnectDB = async () => {}; // Mock connectDB as a no-op function
    attempts = new Attempts(mockConnectDB, mockAllowed, mockLoginAttempts);
});

test.afterEach(() => {
    sandbox.restore();
});

test.serial('isBlocked should return false if there is no attempt', async t => {
    attempts.loginAttempts.findOne.resolves(null);

    const result = await attempts.isBlocked('test@example.com');

    t.false(result);
});

test.serial('isBlocked should return true if attempts are >= 3 and within block period', async t => {
    const mockTimestamp = new Date(Date.now() - (59 * 60 * 1000)); // 59 minutes ago
    attempts.loginAttempts.findOne.resolves({ count: 3, createdAt: mockTimestamp });

    const result = await attempts.isBlocked('test@example.com');

    t.true(result);
});

test.serial('isBlocked should return false if attempts are >= 3 and outside block period', async t => {
    const mockTimestamp = new Date(Date.now() - (61 * 60 * 1000)); // 61 minutes ago
    attempts.loginAttempts.findOne.resolves({ count: 3, createdAt: mockTimestamp });

    const result = await attempts.isBlocked('test@example.com');

    t.false(result);
});

test.serial('updateAttempts should delete attempts if reset is true', async t => {
    await attempts.updateAttempts('test@example.com', true);

    t.true(attempts.loginAttempts.deleteOne.calledOnce);
    t.true(attempts.loginAttempts.deleteOne.calledWith({ email: 'test@example.com' }));
});

test.serial('updateAttempts should increment attempts if already exists', async t => {
    const mockAttempt = { count: 1, save: sandbox.stub().resolves() };
    attempts.loginAttempts.findOne.resolves(mockAttempt);

    await attempts.updateAttempts('test@example.com');

    t.is(mockAttempt.count, 2);
    t.true(mockAttempt.save.calledOnce);
});

test.serial('updateAttempts should create a new attempt if none exists', async t => {
    attempts.loginAttempts.findOne.resolves(null);
    attempts.loginAttempts.create.resolves({ email: 'test@example.com', count: 1 });

    const result = await attempts.updateAttempts('test@example.com');

    t.deepEqual(result, { email: 'test@example.com', count: 1 });
    t.true(attempts.loginAttempts.create.calledOnce);
    t.true(attempts.loginAttempts.create.calledWith({ email: 'test@example.com', count: 1 }));
});

test.serial('verifyUser should return 403 if user is blocked', async t => {
    const req = { body: { email: 'test@example.com' } };
    let responseStatus, responseData;
    const res = {
        status: (status) => {
            responseStatus = status;
            return {
                json: (data) => {
                    responseData = data;
                    return { status, data };
                }
            };
        }
    };

    sandbox.stub(attempts, 'isBlocked').resolves(true);

    await attempts.verifyUser(req, res);

    t.is(responseStatus, 403, 'Expected status to be 403');
    t.deepEqual(responseData, { error: 'Too many failed login attempts. Please try again later.' });
});

test.serial('verifyUser should return 200 and reset attempts if user is allowed', async t => {
    const req = { body: { email: 'test@example.com' } };
    let responseStatus, responseData;
    const res = {
        status: (status) => {
            responseStatus = status;
            return {
                json: (data) => {
                    responseData = data;
                    return { status, data };
                }
            };
        }
    };

    sandbox.stub(attempts, 'isBlocked').resolves(false);
    attempts.allowed.findOne.resolves({ email: 'test@example.com' });

    await attempts.verifyUser(req, res);

    t.is(responseStatus, 200, 'Expected status to be 200');
    t.deepEqual(responseData, { user: 'authenticated' });
});

test.serial('verifyUser should return 401 and increment attempts if user is not allowed', async t => {
    const req = { body: { email: 'test@example.com' } };
    let responseStatus, responseData;
    const res = {
        status: (status) => {
            responseStatus = status;
            return {
                json: (data) => {
                    responseData = data;
                    return { status, data };
                }
            };
        }
    };

    sandbox.stub(attempts, 'isBlocked').resolves(false);
    attempts.allowed.findOne.resolves(null);

    await attempts.verifyUser(req, res);

    t.is(responseStatus, 401, 'Expected status to be 401');
    t.deepEqual(responseData, { user: 'unauthenticated' });
});
