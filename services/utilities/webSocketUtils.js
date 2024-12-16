let wssReference = null;

export const setWebSocketServer = (wss) => {
  wssReference = wss;
};

export const getWebSocketServer = () => {
  if (!wssReference) {
    throw new Error('WebSocket Server is not initialized');
  }
  return wssReference;
};

export const broadcastMetadata = (metadata) => {
  if (!wssReference) {
    console.warn('WebSocket server not initialized; skipping broadcast');
    return;
  }

  if (!metadata.currentTrack || metadata.currentTrack === 'Unknown') {
    console.warn('No valid metadata to broadcast');
    return;
  }

  metadata.startTime = metadata.startTime || Date.now();

  wssReference.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN === 1
      try {
        client.send(JSON.stringify(metadata));
      } catch (error) {
        console.error('Failed to send metadata to WebSocket client:', error.message);
      }
    }
  });
};
