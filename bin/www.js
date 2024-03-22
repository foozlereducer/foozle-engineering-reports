#!/usr/bin/env node

/**
 * Module dependencies.
 */
import {app} from '../app.js';
import {debug} from 'console';
import { logger } from '../services/logger.js';
import https from 'https';
import fs from 'fs';
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// SSL certificate paths
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.cert'))
};



/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTPS server.
 */

// Create the HTTPS server with the SSL options
const server = https.createServer(sslOptions, app)
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// deal with any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception, application is attempting to exit gracefully',)
  logger(500, 'Uncaught exception, application is attempting to exit gracefully', 'fatal')
  // attempt a gracefully shutdown
  server.close(() => {
    console.log('graceful shutdown success')
    process.exit(1); // then exit
  });
  // A graceful shutdown was not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    console.log('graceful shutdown failed, app crashed, core dump created')
    process.abort(); // exit immediately and generate a core dump file
  }, 1000).unref()
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    logger(500, error, 'fatal')
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      const error  = `${bind} is already in use`;
      console.error(error);
      logger(500, error, 'fatal')
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
