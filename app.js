import createError from 'http-errors';
import express from 'express';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


/**
 * Database - MongoDB using Mongoose ORM
 */
import {connectDB} from './datatabase/db.js'
// Connect to MongoDB
connectDB();

import {indexRouter} from './routes/index.js';
import {storyPointsRouter} from './routes/metrics.js';
import {catalogRouter} from './routes/catalog.js';
import { logger } from './services/logger.js';
import { getErrorSeverity } from './services/errorSeverity.js'
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use( async (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

 
  // render the error page
  res.status(err.status || 500);

  await logger(err.status, err.message,getErrorSeverity(err.status))

  res.render('error');
});



