import { winstonInstance } from "./getWinston.js"
import { ActoValidator } from "./validators/ActoValidator.js"
const Validator = new ActoValidator();
Validator.setChainable = false;
const validateThis = Validator.notEmpty("issues");
  
export const logger = async (statusCode, errorMessage, severity, error, winstonInstance) => {
    try {
        Validator.notEmpty(errorMessage)
    } catch(e) {
        errorMessage = '-';
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
