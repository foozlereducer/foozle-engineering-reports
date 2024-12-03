#!/usr/bin/env node

import { app } from '../app.js';
import { debug } from 'console';
import https from 'https';
import { logger } from '../services/logger.js';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  key: fs.readFileSync(`${__dirname}/localhost-key.pem`),
  cert: fs.readFileSync(`${__dirname}/localhost.pem`)
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = https.createServer(options, app);

// Set up a new WebSocket server bound to the existing HTTPS server
export const wss = new WebSocketServer({ server });

wss.onopen = () => {
  console.log('WebSocket connection established');
};

wss.onmessage = (event) => {
  console.log('Received WebSocket message:', event.data);
  const metadata = JSON.parse(event.data);
  trackInfo.value = metadata.currentTrack || 'Metadata not available for this station';
};

wss.onerror = (error) => {
  console.error('WebSocket error:', error);
};

wss.onclose = () => {
  console.log('WebSocket connection closed');
};

wss.on('connection', (ws) => {
  console.log('New client connected via WebSocket');
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception, application is attempting to exit gracefully');
  logger(500, 'Uncaught exception, application is attempting to exit gracefully', 'fatal');
  server.close(() => {
    console.log('Graceful shutdown success');
    process.exit(1);
  });

  setTimeout(() => {
    console.log('Graceful shutdown failed, app crashed, core dump created');
    process.abort();
  }, 1000).unref();
});

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    logger(500, error, 'fatal');
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      const errorMsg = bind + ' is already in use';
      console.error(errorMsg);
      logger(500, errorMsg, 'fatal');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
