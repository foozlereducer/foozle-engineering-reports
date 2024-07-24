import express from 'express';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './services/logger.js';
import {connectDB} from './datatabase/db.js'
import {indexRouter} from './routes/index.js';
import {storyPointsRouter} from './routes/metrics.js';
import {catalogRouter} from './routes/catalog.js';
import { authRouter } from './routes/auth.js';
import { logRouter } from './routes/log.js';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

/**** Get authentication config ******/
// Define the reverse proxy route
const proxyOptions = {
  target:  'https://' + process.env.FIREBASE_URL, // Target host
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    '^/__/auth/': '/__/auth/' // Rewrite path
  },
  secure: false // Set to true if your target server uses HTTPS
};

// Create the reverse proxy middleware
const proxy = createProxyMiddleware('/__/auth/', proxyOptions);

// Use the reverse proxy middleware
app.use(proxy);

// view engine setup
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONT_END_URL, // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use('/', indexRouter);
app.use('/api/storyPoints', storyPointsRouter);
app.use('/api/metrics', catalogRouter);
app.use('/', authRouter);
app.use('/', logRouter);
// Middleware to log cookies
app.use((req, res, next) => {
  console.log('Cookies before handling request:', req.cookies);
  next();
});

/**
 * Database - MongoDB using Mongoose ORM
 */
// Connect to MongoDB
connectDB();

// last stop error handler
// app.use(errHandle);

// Catch-all route for undefined routes
app.all('*', async (req, res) => {
  res.status(404).send(`Route ${req.url} is not found`);
  await logger(404, `Route ${req.url} is not found`, 'error', `Route ${req.url} is not found`)
});






