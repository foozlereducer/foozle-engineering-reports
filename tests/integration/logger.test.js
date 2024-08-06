import test from 'ava';
import { logger } from '../../services/logger.js';

test('A default error severity should be set to "error"', async (t) => {
    const statusCode = 401;
    const message = 'boo'
    const logResults = await logger(statusCode, message);
    t.is('error',logResults.severity)
});

test(`A record is inserted and confirmed that has statusCode, message, 
    severity, createdAt and _id`,
    async t => {
        const statusCode = 404;
        const message = 'Route not found';
        const logResults = await logger(statusCode, message, 'error', 'this is the erro stack');
        t.is('error',logResults.severity)
        t.is(statusCode, logResults.statusCode);
        t.is(message, logResults.message)
        t.is( 'this is the erro stack',logResults.error)
        t.true(typeof logResults._id !== 'undefined')
})
