import { LogSchema } from "../models/log.js";
import { connectDB } from "../datatabase/db.js";

export const logger = async (statusCode, errorMessage, severity = 'error') => {
   
    const severities = ['fatal', 'error', 'debug', 'info'];
    
    // Ensure the severity is one of the enumerated values.
    if (!severities.includes(severity)) {
        severity = 'error';
    }
    const createdAt =  new Date();
    let log = new LogSchema({
        statusCode: statusCode,
        message: errorMessage,
        severity: severity,
        createdAt:createdAt
    });

    try {
        connectDB();
        return await log.save();
    } catch(e) {
        console.log(e)
    }   
};
