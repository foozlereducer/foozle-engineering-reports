import test from 'ava';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';

const mockRequest = (body = {}) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

const mockNext = () => {
    const next = (err) => {
        next.err = err;
        return next;
    };
    return next;
};

// Test case where the middleware should pass
test('Middleware should pass with valid data', t => {
    const req = mockRequest({ age: 25 });
    const res = mockResponse();
    const next = mockNext();

    const validatorMiddleware = ActoValidator.validateMiddleware(
        (req) => new ActoValidator().validate(req.body.age).num().min(18)
    );

    validatorMiddleware(req, res, next);

    t.falsy(next.err); // Ensure next was called without errors
    t.is(res.statusCode, undefined); // Ensure no response was sent
});

// Test case where the middleware should fail and send a response
test('Middleware should fail with invalid data', t => {
    const req = mockRequest({ age: 15 });
    const res = mockResponse();
    const next = mockNext();

    const validatorMiddleware = ActoValidator.validateMiddleware(
        (req) => new ActoValidator().validate(req.body.age).num().min(18)
    );

    validatorMiddleware(req, res, next);

    t.is(res.statusCode, 400); // Ensure a response was sent with status 400
    t.is(res.data.error, 'Number expected to be at least 18'); // Ensure correct error message
});

// Test case where multiple validators are chained
test('Middleware should chain multiple validators and pass', t => {
    const req = mockRequest({ age: 25, name: 'Steve' });
    const res = mockResponse();
    const next = mockNext();

    const validatorMiddleware = ActoValidator.validateMiddleware(
        (req) => new ActoValidator().validate(req.body.age).num().min(18),
        (req) => new ActoValidator().validate(req.body.name).String().notEmpty()
    );

    validatorMiddleware(req, res, next);

    t.falsy(next.err); // Ensure next was called without errors
    t.is(res.statusCode, undefined); // Ensure no response was sent
});

// Test case where multiple validators are chained and one fails
test('Middleware should chain multiple validators and fail', t => {
    const req = mockRequest({ age: 25, name: '' });
    const res = mockResponse();
    const next = mockNext();

    const validatorMiddleware = ActoValidator.validateMiddleware(
        (req) => new ActoValidator().validate(req.body.age).num().min(18),
        (req) => new ActoValidator().validate(req.body.name).String().notEmpty()
    );

    validatorMiddleware(req, res, next);

    t.is(res.statusCode, 400); // Ensure a response was sent with status 400
    t.is(res.data.error, 'The value passed into validate is empty, it needs a value to test'); // Ensure correct error message
});
