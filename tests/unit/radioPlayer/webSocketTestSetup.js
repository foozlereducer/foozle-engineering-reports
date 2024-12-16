import https from 'https';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';
import { createTestApp } from './testApp.js';
import { radioRouter } from '../../../routes/radio.js';

export const startTestServer = (port) => {
    
    // Resolve __dirname for ES modules
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    console.log('__dirname for the bin dir', __dirname)
    // Load HTTPS options
    const options = {
      key: fs.readFileSync(`${__dirname}/localhost-key.pem`),
      cert: fs.readFileSync(`${__dirname}/localhost.pem`),
    };
  
    const app = createTestApp(); // Use the test-specific app instance
    app.use(radioRouter)
    const server = https.createServer(options, app);
    const wss = new WebSocketServer({ server });
  
    return new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`Test server started on port ${port}`);
        resolve({ server, wss });
      });
    });
  };

export const stopTestServer = (server) => {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('Test server stopped');
      resolve();
    });
  });
};
