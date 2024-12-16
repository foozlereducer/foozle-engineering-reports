// tests/helpers/testWebSocketServer.js
import { WebSocketServer } from 'ws';

export const createTestWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Test WebSocket client connected');
    ws.on('message', (message) => {
      console.log('Test received message:', message);
    });
  });

  return wss;
};
