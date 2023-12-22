import test from 'ava';
import sinon from 'sinon';
import { errHandle } from '../../../services/errorHandlers/errorMiddleware.js';

const getError = (status = 500, message = 'internal server error') => {
    class TestError extends Error {
        constructor(status, message) {
            super(message);
            this.name = this.constructor.name;
            this.status = status;
        }
    }

    return  new TestError(status, message);
}

test('The error handler should have an error with status of 500 and a error message of internal server error', async t => {
    const testError = getError()
    const req = {};
    
    // Stub the 'status' and 'json' methods of the 'res' object
    const res = {
        status: sinon.stub().returnsThis(), // Stub 'status' to return the 'res' object
        json: sinon.stub()
    };
    // Stub next method
    const next = sinon.stub();
    // resolve the error handler middleware
    await errHandle(testError, req, res, next);
   
    // assertions
    t.true(res.status.calledWith(500), 'res.status should be called with 500');
    t.true(res.json.calledWith({ error: 'internal server error' }), 'res.json should be called with the expected JSON');
});
