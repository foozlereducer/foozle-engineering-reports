import test from 'ava';
import { HttpStatusCodes } from '../../errorHandlers/httpStatusCodes.js';

test('HttpStatusCodes constants should have correct values', t => {
    t.is(HttpStatusCodes.OK, 200);
    t.is(HttpStatusCodes.BAD_REQUEST, 400);
    t.is(HttpStatusCodes.NOT_FOUND, 404);
    t.is(HttpStatusCodes.NOT_ACCEPTABLE, 406);
    t.is(HttpStatusCodes.INTERNAL_SERVER, 500);
});

test('HttpStatusCodes constants should be read-only', t => {
    const attemptToModify = () => {
        HttpStatusCodes.OK = 201;
    };

    t.throws(attemptToModify, { instanceOf: TypeError });
  
});