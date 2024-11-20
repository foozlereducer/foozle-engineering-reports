import test from 'ava';
import sinon from 'sinon';
import { logger } from '../../services/logger.js';

/**
 * The logger is a wrapper for the Winston logger. These tests don't test the well
 * tested Winston; instead they focus that passing log severities write to 
 * the correct Winston severity 
 */

// Define all the severities your logger can handle
const severities = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'];

test.beforeEach(t => {
    // Create a Winston mock with Sinon
    t.context.winstonMock = {
        log: sinon.stub()
    };
});

test.afterEach.always(t => {
    sinon.restore(); // Restore the stubbed methods
});

// Test each severity level
severities.forEach(severity => {
    test(`logger should call winston's log method with severity "${severity}"`, async t => {
        const { winstonMock } = t.context;
        const statusCode = 500;
        const errorMessage = 'Test message';
        const error = 'Test error';

        await logger(statusCode, errorMessage, severity, error, winstonMock);

        t.true(winstonMock.log.calledOnce, `Winston's log method should be called once for severity "${severity}"`);
        t.true(
            winstonMock.log.calledWith(severity, `${statusCode} | ${errorMessage}: ${error}`),
            `Winston's log method should be called with severity "${severity}" and expected message`
        );
    });
});

// Test for invalid severity
test('logger should do nothing for invalid severity', async t => {
    const { winstonMock } = t.context;
    const statusCode = 500;
    const errorMessage = 'Test message';
    const error = 'Test error';
    const invalidSeverity = 'invalid_severity';

    await logger(statusCode, errorMessage, invalidSeverity, error, winstonMock);

    t.false(winstonMock.log.called, `Winston's log method should not be called for invalid severity "${invalidSeverity}"`);
});

// Test for missing errorMessage (fallback to '-')
test('logger should handle missing errorMessage', async t => {
    const { winstonMock } = t.context;
    const statusCode = 500;
    const severity = 'error';
    const error = 'Test error';
    const emptyErrorMessage = '';

    await logger(statusCode, emptyErrorMessage, severity, error, winstonMock);

    console.log('Winston log call args:', winstonMock.log.getCall(0).args);

    t.true(winstonMock.log.calledOnce, `Winston's log method should be called once for severity "${severity}"`);
    t.true(
        winstonMock.log.calledWith(severity, `${statusCode} | -: ${error}`),
        `Winston's log method should be called with fallback message for empty errorMessage`
    );
});

