import { logger } from '../logger.js';
import { getErrorSeverity } from '../errorSeverity.js'

// Handler for errors
export const errHandle = (err, req, res, next) => {
    // render the error page
    res.status(err.status || 500).json({ error: err.message });
    const severity = getErrorSeverity(err.status)
    logger(err.status, err.message, severity)
}