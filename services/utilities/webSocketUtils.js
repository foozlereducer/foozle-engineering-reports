// websocketUtils.js
import { WebSocket } from 'ws';

let wssReference = null;

export const setWebSocketServer = (wss) => {
  wssReference = wss;
};

export const getWebSocketServer = () => {
  return wssReference;
};

export const broadcastMetadata = (metadata) => {
  const wss = getWebSocketServer();
  if (!wss || !metadata.currentTrack || metadata.currentTrack === 'Unknown') {
    console.warn('No valid metadata to broadcast or WebSocket not initialized');
    return;
  }

  metadata.startTime = metadata.startTime || Date.now();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(metadata));
      } catch (error) {
        console.error('Failed to send metadata to WebSocket client:', error.message);
      }
    }
  });
};
