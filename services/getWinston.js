import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const getWinston = () => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'  // Keep logs for the last 14 days
            })
        ]
    });
}

export const winstonInstance = getWinston();