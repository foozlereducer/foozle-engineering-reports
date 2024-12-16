// services/utilities/webSocketServer.js
import { WebSocketServer } from 'ws';

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received WebSocket message:', message);
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });
  });

  return wss;
};
