import { LogSchema } from "../models/log.js";

export const logger = (statusCode, errorMessage, severity = 'error') => {

    const severities = ['fatal', 'error', 'debug', 'info'];

    if ( !severities.includes(severity)) {
        severity = 'error'
    }

    const setLog = async (statusCode, errorMessage, severity) => {
        let log = new LogSchema({
            statusCode: statusCode,
            message: errorMessage,
            severity: severity,
            createdAt: new Date()
        })
    
        await log.save();
        log = null;
    }

    setLog(statusCode, errorMessage, severity)
    
}
