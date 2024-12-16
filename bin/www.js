#!/usr/bin/env node

import { app } from '../app.js';
import { logger } from '../services/logger.js';
import { createServer } from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createWebSocketServer } from '../services/webSocketServer.js';
import { setWebSocketServer } from '../services/utilities/webSocketUtils.js';

// Resolve __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load HTTPS options
const options = {
  key: fs.readFileSync(`${__dirname}/localhost-key.pem`),
  cert: fs.readFileSync(`${__dirname}/localhost.pem`),
};

// Normalize port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTPS server
const server = createServer(options, app);

// Create WebSocket server and integrate with the app
export const wss = createWebSocketServer(server);
app.locals.wss = wss; // Attach WebSocket server to app.locals for routes or modules
setWebSocketServer(wss); // Dynamically provide WebSocket server reference to modules

// Start HTTPS server
server.listen(port, () => console.log(`Server listening on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);

// Graceful shutdown for uncaught exceptions
process.on('uncaughtException', (err) => handleUncaughtException(err, server));

// ----------------------------- Utility Functions -----------------------------

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

/**
 * Handle errors during server startup.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    logger(500, error, 'fatal');
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      const errorMsg = `${bind} is already in use`;
      console.error(errorMsg);
      logger(500, errorMsg, 'fatal');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Handle the server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

/**
 * Gracefully handle uncaught exceptions.
 */
function handleUncaughtException(err, server) {
  console.error('Uncaught exception occurred, attempting graceful shutdown');
  logger(500, 'Uncaught exception, shutting down', 'fatal');
  server.close(() => {
    console.log('Graceful shutdown completed');
    process.exit(1);
  });

  setTimeout(() => {
    console.error('Graceful shutdown failed, forcing process exit');
    process.abort();
  }, 1000).unref();
}
