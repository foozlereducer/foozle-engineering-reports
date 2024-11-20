export const logger = async (statusCode, errorMessage, severity, error, winstonInstance) => {
    if (!errorMessage || errorMessage.trim() === "") {
        errorMessage = "-";
    }

    const logMsg = `${statusCode} | ${errorMessage}: ${error}`;
    switch (severity) {
        case 'emerg':
            winstonInstance.log('emerg', logMsg)
            break;
        case 'alert':
            winstonInstance.log('alert', logMsg)
            break;
        case 'crit':
            winstonInstance.log('crit', logMsg)
            break;
        case 'error':
            winstonInstance.log('error', logMsg)
            break;
        case 'warning':
            winstonInstance.log('warning', logMsg)
            break;
        case 'notice':
            winstonInstance.log('notice', logMsg)
            break;
        case 'info':
            winstonInstance.log('info', logMsg)
            break;
        case 'debug':
            winstonInstance.log('debug', logMsg)
            break;
        default:
            break;
    }    
};
