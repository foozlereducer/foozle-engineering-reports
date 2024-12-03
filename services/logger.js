import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

// Ensure the 'logs' directory exists
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// Define custom log levels and colors
const customLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warn: 4,
        notice: 5,
        info: 6,
        debug: 7,
    },
    colors: {
        emerg: 'red',
        alert: 'yellow',
        crit: 'red bold',
        error: 'red',
        warn: 'yellow',
        notice: 'cyan',
        info: 'green',
        debug: 'blue',
    },
};

// Apply colors to Winston
winston.addColors(customLevels.colors);

// Custom format function to handle error objects and add statusCode if applicable
const customFormat = winston.format.printf(({ timestamp, level, message, statusCode }) => {
    let logMessage = message;

    // Check if message is an Error object
    if (message instanceof Error) {
        logMessage = `${message.message}\n${message.stack}`;
    } else if (typeof message === 'object') {
        // If message is an object, stringify it
        logMessage = JSON.stringify(message, null, 2);
    }

    // If statusCode is greater than 0, prepend it to the message
    if (statusCode > 0) {
        logMessage = `Status ${statusCode} | ${logMessage}`;
    }

    return `${timestamp} [${level}]: ${logMessage}`;
});

// Create the default Winston instance using custom levels
export const defaultWinstonInstance = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format((info) => {
            if (typeof info.message === 'object' && 'statusCode' in info.message) {
                info.statusCode = info.message.statusCode;
                info.message = info.message.message;
            }
            return info;
        })(),
        customFormat
    ),
    transports: [
        // File transport without JSON format, similar to the older format
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'debug', // Log everything from 'debug' upwards to file
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format((info) => {
                    if (typeof info.message === 'object' && 'statusCode' in info.message) {
                        info.statusCode = info.message.statusCode;
                        info.message = info.message.message;
                    }
                    return info;
                })(),
                customFormat
            )
        }),
        // Console transport with color for development, starting at 'info' level
        new winston.transports.Console({
            level: 'info', // Log 'info' and above to console
            format: winston.format.combine(
                winston.format.colorize(), // Apply color to console output
                winston.format.timestamp(),
                winston.format((info) => {
                    if (typeof info.message === 'object' && 'statusCode' in info.message) {
                        info.statusCode = info.message.statusCode;
                        info.message = info.message.message;
                    }
                    return info;
                })(),
                customFormat
            )
        }),
    ]
});

// Export logger function
export const logger = (
    statusCode = 0,
    level = '',
    error = '',
    winstonInstance = defaultWinstonInstance
) => {
    const logMsg = processErrorMsg(statusCode, error);

    // Check if the severity level is valid before logging
    if (winstonInstance.levels[level] !== undefined) {
        winstonInstance.log(level, logMsg);
    } else {
        console.warn(`Invalid level "${level}" provided. Message not logged.`);
    }
};

// Helper function to format the error message
function processErrorMsg(statusCode, error) {
    if (!error || error.trim() === "") {
        throw new Error('logger requires a message');
    }

    // If the error is an instance of Error, return it directly to be processed by the formatter
    if (error instanceof Error) {
        return { statusCode, message: error };
    }

    let errorStr = '';
    if (statusCode > 0) {
        errorStr = `${error}`;
        return { statusCode, message: errorStr };
    } else {
        return error; // If no statusCode, return the original error
    }
}
