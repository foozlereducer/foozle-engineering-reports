import test from 'ava';
import { logger } from '../../services/logger.js';

test('A default error severity should be set to "low"', async (t) => {
    const statusCode = 401;
    const error = 'unauthorized';
    const logResults = await logger(statusCode, error);
    t.is('low',logResults.severity)
});

test(`A record is inserted and confirmed that has statusCode, message, 
    severity, createdAt and _id`,
    async t => {
        const statusCode = 404;
        const message = 'Route not found';
        const logResults = await logger(statusCode, message);
    
        t.is('low',logResults.severity)
        t.is(statusCode, logResults.statusCode);
        t.is(message, logResults.message)
        t.true(typeof logResults._id !== 'undefined')
})
