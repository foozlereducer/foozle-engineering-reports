import {logger} from '../services/logger.js';

export const kog = async (req, res) => {
    const { status, message, severity, stack} = req.body;
    logger(status,message, severity, stack )
}

