import express from 'express';

/** Authentication */
import session from 'express-session'
import passport, { Passport } from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
/** End Authentication */

import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
/** Logger */
import { logger } from './services/logger.js';
/** Database */
import {connectDB} from './datatabase/db.js'

/** Routes */
import {indexRouter} from './routes/index.js';
import {storyPointsRouter} from './routes/metrics.js';
import {catalogRouter} from './routes/catalog.js';
import { authRouter } from './routes/auth.js';
import { logRouter } from './routes/log.js';

/** Plugins  */
import { jiraMetricsRouter } from './plugins/Jira/routes/metricsRoutes.js';
/** End Plugins */
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();
// CORS configuration
const corsOptions = {
  origin: process.env.FRONT_END_URL, // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Enable CORS with the specified options
app.use(cors(corsOptions));


app.use(session({
  secret: "$,x<b{s`_|ZCAW,",
  resave: false,
  saveUninitialized: true,
}))

// Initialize Passport 
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/google/auth/callback'
  }, 
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  }
))

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Handle preflight requests
app.use('/', indexRouter);
app.use('/api/storyPoints', storyPointsRouter);
app.use('/api/metrics', catalogRouter);
app.use('/', authRouter);
app.use('/', logRouter);
// view engine setup
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());



/** Plugins */
// Jira Plugin
app.use('/', jiraMetricsRouter)
/** End Plugins */

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


// Catch-all route for undefined routes
app.all('*', async (req, res) => {
  res.status(404).send(`Route ${req.url} is not found`);
  await logger(404, `Route ${req.url} is not found`, 'error', `Route ${req.url} is not found`)
});






