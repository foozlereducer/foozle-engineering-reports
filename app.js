import express from 'express';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { errHandle } from './services/errorHandlers/errorMiddleware.js';
import {indexRouter} from './routes/index.js';
import {catalogRouter} from './routes/catalog.js';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});
app.use(express.json()); 
/**** Get authentication config ******/
// Define the reverse proxy route
const proxyOptions = {
  target: process.env.FIREBASE_URL, // Target host (Firebase authDomain)
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    '^/__/auth/': '/__/auth/' // Rewrite path
  },
  secure: false,
  logLevel: 'debug', // For debugging purposes
};

// Create the reverse proxy middleware
const firebaseAuthProxy = createProxyMiddleware('/__/auth/', proxyOptions);

// Use the reverse proxy middleware
app.use(firebaseAuthProxy);

// view engine setup
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views/frontEnd'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', indexRouter);
app.use('/api/metrics', catalogRouter)

// last stop error handler
app.use(errHandle);

// Catch-all route for undefined routes
// app.all('*', async (req, res) => {
//   res.status(404).send(`Route ${req.url} is not found`);
//   await logger(404, `Route ${req.url} is not found`)
// });







