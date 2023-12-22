import { logger } from '../logger.js';
import { getErrorSeverity } from '../errorSeverity.js';

// Express middleware for Handling errors
export const errHandle = async (err, req, res, next) => {
    // render the error page
    res.status(err.status || 500).json({ error: err.message });
    const severity = getErrorSeverity(err.status);
    await logger(err.status, err.message, severity);

    // Wait for the asynchronous json operation to complete
    await res.json({ error: err.message });

    next();
};
