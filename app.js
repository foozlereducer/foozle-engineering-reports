import createError from 'http-errors';
import express from 'express';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { errHandle } from './services/errorHandlers/errorMiddleware.js';
import { logger } from './services/logger.js';
import {connectDB} from './datatabase/db.js'
import {indexRouter} from './routes/index.js';
import {storyPointsRouter} from './routes/metrics.js';
import {catalogRouter} from './routes/catalog.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();


// view engine setup
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/storyPoints', storyPointsRouter)
app.use('/metrics', catalogRouter)

// Catch-all route for undefined routes
app.all('*', (req, res) => {
  logger(404, `Route ${req.url} is not found`)
  res.status(404).send(`Route ${req.url} is not found`);
});

/**
 * Database - MongoDB using Mongoose ORM
 */
// Connect to MongoDB
connectDB();

// error handler
app.use(errHandle);






