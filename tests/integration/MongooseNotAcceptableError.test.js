import test from 'ava';
import { MongooseNotAcceptable } from '../../errorHandlers/MongooseNotAcceptableError.js';
import { HttpStatusCodes } from '../../errorHandlers/httpStatusCodes.js';
import { BaseError } from '../../errorHandlers/baseError.js';

test('MongooseNotAcceptable should be a subclass of BaseError and have correct values', t => {
    const mongooseError = new MongooseNotAcceptable('Custom description');
    console.log(mongooseError.name)
    t.true(mongooseError instanceof BaseError);
    t.is(mongooseError.name, 'NOT ACCEPTABLE');
    t.is(mongooseError.httpCode, HttpStatusCodes.NOT_ACCEPTABLE);
    t.is(mongooseError.message, 'Custom description');
    t.true(mongooseError.isOperational);
});

test('MongooseNotAcceptable should have default description when not provided', t => {
    const mongooseError = new MongooseNotAcceptable();
    t.is(mongooseError.description, 'bad data');
});