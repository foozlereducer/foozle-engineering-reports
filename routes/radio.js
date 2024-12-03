import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import https from 'https';
import { wss } from '../bin/www.js';
import WebSocket from 'ws'; // Import WebSocket

const router = express.Router();

// Initialize Node Cache with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const axiosInstance = axios.create({
    baseURL: 'https://localhost:3000',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
});

/**
 * Monitor metadata and broadcast to WebSocket clients.
 */
const monitorMetadata = async (streamUrl) => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios({
      method: 'get',
      url: streamUrl,
      headers: {
        'Icy-MetaData': '1',
      },
      responseType: 'stream',
      httpsAgent: agent,
    });

    let icyMetaInt = response.headers['icy-metaint'];
    if (icyMetaInt) {
      icyMetaInt = parseInt(icyMetaInt);
      let streamData = [];
      let currentTrack = null;

      response.data.on('data', (chunk) => {
        streamData.push(chunk);
        if (Buffer.concat(streamData).length >= icyMetaInt) {
          const metadataChunk = Buffer.concat(streamData).slice(icyMetaInt, icyMetaInt + 4080).toString();
          const metadata = extractMetadata(metadataChunk);

          if (metadata.currentTrack && metadata.currentTrack !== currentTrack) {
            currentTrack = metadata.currentTrack;
            metadata.duration = 240; // Assuming a fixed 4-minute track duration for demonstration
            console.log(`Broadcasting metadata: ${metadata.currentTrack}`);
            broadcastMetadata(metadata);
          }

          // Reset stream data to prevent excessive memory usage
          streamData = [];
        }
      });
    }
  } catch (error) {
    console.error('Failed to monitor metadata:', error.message);
  }
};

/**
 * Broadcast metadata to all WebSocket clients.
 */
const broadcastMetadata = (metadata) => {
    if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(metadata));
        }
      });
    }
  };
   
/**
 * Helper function to extract metadata from the stream.
 */
function extractMetadata(metadataChunk) {
    const matches = metadataChunk.match(/StreamTitle='([^']*)';/);
    if (matches && matches[1]) {
      return { currentTrack: matches[1] };
    } else {
      return { currentTrack: 'Unknown' };
    }
}

/**
 * Route to initiate metadata monitoring for a stream URL.
 */
router.post('/api/monitor', (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).send("Stream URL is required");
    }
  
    // Start monitoring metadata for the given stream URL
    monitorMetadata(url);
    res.status(200).send("Metadata monitoring initiated");
  });
/**
 * Get a list of radio stations, caching the results.
 */
router.get('/api/stations', async (req, res) => {
    try {
      const country = req.query.country || 'Canada';
      const limit = req.query.limit || 100;
      const cacheKey = `stations_${country}_${limit}`;
  
      // Check if the result is in the cache
      if (cache.has(cacheKey)) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cache.get(cacheKey));
      }
  
      // Correct the URI format
      const uri = `https://de1.api.radio-browser.info/json/stations/bycountry/${country}?limit=${limit}`;
      console.log(`Fetching from API: ${uri}`);
  
      // If not cached, fetch from the external API
      const response = await axiosInstance.get(uri);
      const data = response.data;
  
      // Store the result in the cache
      cache.set(cacheKey, data);
  
      res.json(data);
    } catch (error) {
      console.error('Failed to fetch radio stations:', error.message);
      console.error(error.stack);
      res.status(500).json({ error: 'Failed to fetch radio stations', details: error.message });
    }
  });
  

/**
 * Proxy a radio station stream to avoid CORS issues.
 */
router.get('/api/stream', async (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.status(400).send("Stream URL is required");
  }

  try {
    const response = await axiosInstance({
      method: 'get',
      url: streamUrl,
      responseType: 'stream'
    });

    // Set headers to indicate this is an audio stream
    res.setHeader('Content-Type', 'audio/mpeg');

    // Pipe the stream to the client
    response.data.pipe(res);
  } catch (error) {
    console.error('Failed to stream the radio station:', error);
    res.status(500).json({ error: 'Failed to stream the radio station', details: error.message });
  }
});

/**
 * Fetch track metadata, caching the results for a short period (30 seconds).
 */
router.get('/api/metadata', async (req, res) => {
    const streamUrl = req.query.url;
  
    if (!streamUrl) {
      return res.status(400).send("Stream URL is required");
    }
  
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
  
      const response = await axios({
        method: 'get',
        url: streamUrl,
        headers: {
          'Icy-MetaData': '1',
        },
        responseType: 'stream',
        httpsAgent: agent,
      });
  
      let icyMetaInt = response.headers['icy-metaint'];
      if (icyMetaInt) {
        icyMetaInt = parseInt(icyMetaInt);
        let streamData = [];
        let currentTrack = null;
  
        response.data.on('data', (chunk) => {
          streamData.push(chunk);
          if (Buffer.concat(streamData).length >= icyMetaInt) {
            const metadataChunk = Buffer.concat(streamData).slice(icyMetaInt, icyMetaInt + 4080).toString();
            const metadata = extractMetadata(metadataChunk);
  
            if (metadata.currentTrack !== currentTrack) {
              currentTrack = metadata.currentTrack;
              // Broadcast metadata to all connected WebSocket clients
              broadcastMetadata(metadata);
              res.json(metadata);
              response.data.destroy();
            }
          }
        });
      } else {
        res.status(404).json({ error: 'No metadata available' });
      }
    } catch (error) {
      console.error('Failed to get metadata:', error.message);
      res.status(500).json({ error: 'Failed to get metadata', details: error.message });
    }
  });

export { router as radioRouter };
