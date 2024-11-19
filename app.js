import express from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './services/logger.js';
import { winstonInstance } from './services/getWinston.js';
import { connectDB } from './datatabase/db.js';
import { indexRouter } from './routes/index.js';
import { storyPointsRouter } from './routes/metrics.js';
import { catalogRouter } from './routes/catalog.js';
import { authRouter } from './routes/auth.js';
import { logRouter } from './routes/log.js';
import { jiraMetricsRouter } from './plugins/Jira/routes/metricsRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

// Middleware Setup
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Session configuration
app.use(session({
  secret: process.env.PASSPORT_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true, 
    httpOnly: true,
    sameSite: 'none'
  }
}));

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
    return done(null, profile);
  })
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware to log cookies
app.use((req, res, next) => {
  next();
});

// Static Files and View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true,
}));

// Define Routes
app.use('/', indexRouter);
app.use('/api/storyPoints', storyPointsRouter);
app.use('/api/metrics', catalogRouter);
app.use('/', authRouter);
app.use('/', logRouter);
app.use('/', jiraMetricsRouter);

// Catch-all route for undefined routes
app.all('*', async (req, res) => {
  const message = `Route ${req.url} is not found`;
  await logger(404, '', 'error', message, winstonInstance);
  res.status(404).send(message);
});