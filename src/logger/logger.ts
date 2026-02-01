import winston from 'winston';
import path from 'path';

const logDir = path.resolve('logs');

const logFormat = winston.format.printf(({level, message, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'test.log')
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        })
    ]
});

if (process.env.NODE_ENV !== 'ci') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    );
}

export default logger;
