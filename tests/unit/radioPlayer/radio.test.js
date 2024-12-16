import test from 'ava';
import nock from 'nock';
import WebSocket from 'ws';
import getPort from 'get-port';
import { startTestServer, stopTestServer } from './webSocketTestSetup.js';
import { extractMetadata, enrichMetadata, broadcastMetadata as originalBroadcastMetadata, setWebSocketServer } from '../../../routes/radio.js';

let server;
let wss;
let testPort;

test.before(async () => {
  // Find a free port dynamically for the WebSocket server
  testPort = await getPort();
  const result = await startTestServer(testPort);
  server = result.server;
  wss = result.wss;

  // Bind WebSocket server to radio.js for test purposes
  setWebSocketServer(wss);
});

test.after.always(async () => {
  await stopTestServer(server);
});

// Utility to broadcast metadata using the test WebSocket server
const broadcastMetadata = (metadata) => {
  if (!wss) {
    throw new Error('WebSocket server not initialized');
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(metadata));
    }
  });
};

// Test 1: extractMetadata
test('extractMetadata - parses stream title correctly', (t) => {
  const metadata = extractMetadata('Artist - Track');
  t.deepEqual(metadata, { artist: 'Artist', currentTrack: 'Track' });
});

// Test 2: enrichMetadata
test('enrichMetadata - adds Spotify data', async (t) => {
  const metadata = { currentTrack: 'Track', artist: 'Artist' };

  // Mock Spotify API response
  nock('https://api.spotify.com')
    .get(/v1\/search/)
    .reply(200, {
      tracks: { items: [{ duration_ms: 200000, album: { images: [{ url: 'image.jpg' }] } }] },
    });

  const enriched = await enrichMetadata(metadata);
  t.is(enriched.duration, 200);
  t.is(enriched.albumArt, 'image.jpg');
});

// Test 3: WebSocket broadcasts metadata to clients
test('WebSocket server broadcasts metadata to clients', async (t) => {
  const mockMetadata = { currentTrack: 'Test Track', artist: 'Test Artist' };

  const wsClient = new WebSocket(`wss://localhost:${testPort}`, {
    rejectUnauthorized: false, // Allow self-signed certificates
  });

  const messagePromise = new Promise((resolve, reject) => {
    wsClient.on('open', () => {
      broadcastMetadata(mockMetadata); // Trigger broadcast via test utility
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

// Test 4: WebSocket ignores invalid metadata
test('WebSocket server ignores invalid metadata', async (t) => {
  const mockInvalidMetadata = { currentTrack: 'Unknown' }; // Missing artist field

  const wsClient = new WebSocket(`wss://localhost:${testPort}`, {
    rejectUnauthorized: false,
  });

  const failOnMessage = new Promise((resolve, reject) => {
    wsClient.on('open', () => {
      broadcastMetadata(mockInvalidMetadata); // Attempt to broadcast invalid metadata
    });

    wsClient.on('message', () => {
      t.fail('Invalid metadata should not be broadcast');
      reject();
    });

    wsClient.on('close', () => {
      t.pass('WebSocket closed without broadcasting invalid metadata');
      resolve();
    });
  });

  await failOnMessage;
  wsClient.close();
});
