import test from 'ava';
import sinon from 'sinon';
import { errHandle } from '../../../services/errorHandlers/errorMiddleware.js';


test('The error handler should have an error with status of 500 and a error message of internal server error', async t => {
    class TestError extends Error {
        constructor(status, message) {
            super(message);
            this.name = this.constructor.name;
            this.status = status;
        }
    }

    const testError = new TestError(500, 'internal server error');
    const req = {};
    
    // Stub the 'status' and 'json' methods of the 'res' object
    const res = {
        status: sinon.stub().returnsThis(), // Stub 'status' to return the 'res' object
        json: sinon.stub()
    };

    const next = sinon.stub();
  
    await errHandle(testError, req, res, next);
   

    // assertions
    t.true(res.status.calledWith(500), 'res.status should be called with 500');
    t.true(res.json.calledWith({ error: 'internal server error' }), 'res.json should be called with the expected JSON');
});
