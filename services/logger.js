import { LogSchema } from "../models/log.js";

export const logger = async (statusCode, errorMessage, severity = 'error') => {
    let log = new LogSchema({
        statusCode: statusCode,
        message: errorMessage,
        severity: severity,
        createdAt: new Date()
    })

    await log.save();
    log = null;
}
