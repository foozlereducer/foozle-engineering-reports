import express from 'express';
import { log } from '../controllers/logController.js';
import { logger } from '../services/logger.js';
const router = express.Router();

router.post(
    '/v1/api/log',
    log(logger)
)

export {router as logRouter};