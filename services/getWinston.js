import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const createLogger = (() => {
    let loggerInstance = null;

    return (useConsoleTransport = false) => {
        if (!loggerInstance) {
            const transports = [
                new DailyRotateFile({
                    filename: 'logs/application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                })
            ];

            if (useConsoleTransport) {
                transports.push(new winston.transports.Console());
            }

            loggerInstance = winston.createLogger({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                transports
            });
        }
        return loggerInstance;
    };
})();

export const getWinston = (useConsoleTransport = false) => createLogger(useConsoleTransport);
