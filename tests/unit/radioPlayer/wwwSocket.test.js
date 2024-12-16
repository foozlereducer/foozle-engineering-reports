import test from 'ava';
import { createServer } from 'https';
import getPort from 'get-port';
import { createTestWebSocketServer } from './testWebSocketServer.js';
import { setWebSocketServer, getWebSocketServer } from '../../../services/utilities/webSocketUtils.js';
import { extractMetadata, broadcastMetadata } from '../../../routes/radio.js';
import WebSocket from 'ws';

let server, testPort;

test.before(async () => {
  // Dynamically allocate a free port for the test server
  testPort = await getPort();
  server = createServer(); // Create an HTTPS server instance
  const wss = createTestWebSocketServer(server); // Create a WebSocket server bound to the HTTPS server

  setWebSocketServer(wss); // Dynamically inject the WebSocket server for broadcasting
  server.listen(testPort); // Start listening on the allocated port
});

test.after.always(() => {
  server.close(); // Ensure the server shuts down after tests
});

// Test: WebSocket server accepts client connections
test('WebSocket server accepts client connections', async (t) => {
  const wsClient = new WebSocket(`wss://localhost:${testPort}`, {
    rejectUnauthorized: false, // Accept self-signed certificates
  });

  const connectionPromise = new Promise((resolve, reject) => {
    wsClient.on('open', resolve); // Resolve when connection is successful
    wsClient.on('error', reject); // Reject if an error occurs
  });

  await connectionPromise;
  t.pass('Client successfully connected to WebSocket server');
  wsClient.close();
});

// Test: WebSocket server broadcasts metadata to clients
test('WebSocket server broadcasts metadata to clients', async (t) => {
  const mockMetadata = { currentTrack: 'Test Track', artist: 'Test Artist' };

  const wsClient = new WebSocket(`wss://localhost:${testPort}`, {
    rejectUnauthorized: false, // Accept self-signed certificates
  });

  const messagePromise = new Promise((resolve, reject) => {
    wsClient.on('open', () => {
      broadcastMetadata(mockMetadata); // Trigger broadcast from the server
    });

    wsClient.on('message', (message) => {
      const receivedData = JSON.parse(message);
      t.is(receivedData.currentTrack, 'Test Track');
      t.is(receivedData.artist, 'Test Artist');
      resolve();
    });

    wsClient.on('error', reject);
  });

  await messagePromise;
  wsClient.close();
});

// Test: WebSocket server handles incoming messages correctly
test('WebSocket server handles messages correctly', async (t) => {
  const wsClient = new WebSocket(`wss://localhost:${testPort}`, {
    rejectUnauthorized: false, // Accept self-signed certificates
  });

  const messagePromise = new Promise((resolve, reject) => {
    wsClient.on('open', () => {
      wsClient.send(JSON.stringify({ type: 'test', data: 'Hello, server!' })); // Send a test message
    });

    const wss = getWebSocketServer(); // Get the current WebSocket server instance
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        t.is(parsedMessage.type, 'test');
        t.is(parsedMessage.data, 'Hello, server!');
        resolve();
      });
    });

    wsClient.on('error', reject);
  });

  await messagePromise;
  wsClient.close();
});
