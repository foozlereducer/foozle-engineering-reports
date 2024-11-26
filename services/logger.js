import winston from 'winston';

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

// Create the default Winston instance using custom levels
export const defaultWinstonInstance = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        // Console transport with color for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Apply color to console output
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        }),
        // File transport without color codes for JSON format log files
        new winston.transports.File({
            filename: 'logs/application.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json() // JSON format for structured logging
            )
        })
    ]
});

// Export logger function
export const logger = async (
    statusCode = 0, 
    errorMessage = '', 
    severity = '',
    error = '', 
    winstonInstance = defaultWinstonInstance
) => {
    const logMsg = processErrorMsg(errorMessage, statusCode, error);

    // Check if the severity level is valid before logging
    if (winstonInstance.levels[severity] !== undefined) {
        winstonInstance.log(severity, logMsg);
    } else {
        console.warn(`Invalid severity "${severity}" provided. Message not logged.`);
    }
};

// Helper function to format the error message
function processErrorMsg(errorMessage, statusCode, error) {
    if (!errorMessage || errorMessage.trim() === "") {
        throw new Error('logger requires a msg');
    }

    let errorStr = '';
    if (statusCode === 0) {
        errorStr = `${errorMessage}: ${error}`;
    } else {
        errorStr = `${statusCode} | ${errorMessage}: ${error}`;
    }
    return errorStr;
}
