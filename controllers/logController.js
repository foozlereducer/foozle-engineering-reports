import {logger} from '../services/logger.js';

export const log = async (req, res) => {
    const { status, message, severity, stack} = req.body;
    const response = await logger(status,message, severity, stack )
    res.send(response)
}

