import {logger} from '../services/logger.js';

export const log = async (req, res) => {
    const { status, message, severity, error} = req.body;
    const response = await logger(status, message, severity, error )
    res.send(response)
}

