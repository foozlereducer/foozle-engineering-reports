import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import https from 'https';
import icy from 'icy'; // Import the icy module
import { wss } from '../bin/www.js';
import { fetchSpotifyTrackMetadata } from '../services/spotifyTrackSearch.js';
import { broadcastMetadata } from '../services/utilities/webSocketUtils.js';

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
const monitorMetadata = (streamUrl) => {
  icy.get(streamUrl, (res) => {
    console.log(`Connected to stream: ${streamUrl}`);

    let currentTrack = null;
    let isConnectionAlive = true;

    setInterval(() => {
      if (!isConnectionAlive) {
        console.warn('Stream connection lost. Reconnecting...');
        res.destroy();
        monitorMetadata(streamUrl);
      }
      isConnectionAlive = false;
    }, 30000);

    res.on('data', (chunk) => {
      isConnectionAlive = true; // Connection is alive if data is received
    });

    res.on('metadata', (metadata) => {
      console.log('Metadata event triggered');
      try {
        const parsedMetadata = icy.parse(metadata);
        

        const trackInfo = parsedMetadata?.StreamTitle || 'Unknown';
        if (trackInfo !== currentTrack) {
          currentTrack = trackInfo;
          const metadataObj = extractMetadata(trackInfo);

          broadcastMetadata(metadataObj);

          enrichMetadata(metadataObj).then((enrichedMetadata) => {
            broadcastMetadata(enrichedMetadata);
          }).catch((error) => {
            console.error('Error enriching metadata:', error.message);
          });
        } else {
          console.log('Duplicate metadata detected, skipping broadcast');
        }
      } catch (error) {
        console.error('Error processing metadata:', error.message);
      }
    });

    res.on('end', () => {
      console.log('Stream ended. Reconnecting...');
      setTimeout(() => monitorMetadata(streamUrl), 5000);
    });

    res.on('error', (err) => {
      console.error('Stream error:', err.message);
      setTimeout(() => monitorMetadata(streamUrl), 5000);
    });
  }).on('error', (err) => {
    console.error('Failed to connect to stream:', err.message);
    setTimeout(() => monitorMetadata(streamUrl), 5000);
  });
};


const log = (action, data) => {
  console.log(action)
  console.log(data)
}
const addArtistToMetadata = (metadata) => {
  if (metadata.currentTrack) {
    const trackParts = metadata.currentTrack.split(' - ');
    const artist = trackParts[0] ? trackParts[0].trim() : 'Unknown Artist';
    return {artist: artist};
  }
  return metadata;
}

function extractMetadata(streamTitle) {
  console.log('Parsing StreamTitle:', streamTitle);

  if (!streamTitle || typeof streamTitle !== 'string') {
    console.warn('Invalid StreamTitle received. Returning fallback metadata.');
    return { currentTrack: 'Unknown', artist: 'Unknown Artist' };
  }

  const [artist, track] = streamTitle.split(' - ').map((part) => part.trim());
  return {
    currentTrack: track || 'Unknown',
    artist: artist || 'Unknown Artist',
  };
}

const enrichMetadataCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache enriched metadata for 10 minutes

/**
 * Enrich Metadata
 * @param {object} metadata - The original metadata object
 * @returns {object} - Metadata enriched with duration and album art
 */
const enrichMetadata = async (metadata) => {
  const { currentTrack, artist } = metadata;

  if (!currentTrack || !artist || currentTrack === 'Unknown' || artist === 'Unknown Artist') {
    console.warn('Metadata is missing valid currentTrack or artist. Skipping enrichment.');
    return metadata; // Return original metadata if enrichment isn't possible
  }

  const cacheKey = `${artist}-${currentTrack}`;
  const cachedData = enrichMetadataCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached enriched metadata for ${cacheKey}`);
    return cachedData;
  }

  try {
    console.log(`Fetching enriched metadata for ${cacheKey} from Spotify...`);
    const spotifyData = await fetchSpotifyTrackMetadata(currentTrack, artist);

    if (spotifyData) {
      const enrichedData = {
        ...metadata,
        ...spotifyData,
      };

      enrichMetadataCache.set(cacheKey, enrichedData); // Cache enriched metadata
      return enrichedData;
    }
  } catch (error) {
    console.error('Failed to enrich metadata:', error.message);
  }

  // Return original metadata with a default duration if enrichment fails
  return { ...metadata, duration: 240 }; // Default to 4 minutes
};


const mergeObjs = (aObj, bObj) =>{
  return {
    ...aObj,
    ...bObj,
  };
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

export {extractMetadata, broadcastMetadata, enrichMetadata, monitorMetadata}
export { router as radioRouter };
