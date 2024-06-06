import express from 'express';
import {log} from '../controllers/logController.js'
const router = express.Router();

router.post(
    "/v1/api/log", 
    log
)

export {router as logRouter};