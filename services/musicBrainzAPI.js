import axios from 'axios';
import NodeCache from 'node-cache';

// Cache with a TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const getTrackDurationFromMusicBrainz = async (trackName, artistName) => {
  if (!trackName || !artistName || trackName === 'Unknown' || artistName === 'Unknown Artist') {
    console.warn('Invalid track or artist data. Skipping MusicBrainz lookup.');
    return null;
  }

  // Check cache first
  const cacheKey = `${trackName}:${artistName}`;
  if (cache.has(cacheKey)) {
    console.log(`Serving duration from cache for: ${trackName} - ${artistName}`);
    return cache.get(cacheKey);
  }

  try {
    console.log(`Querying MusicBrainz for: ${trackName} - ${artistName}`);
    const response = await axios.get('https://musicbrainz.org/ws/2/recording/', {
      params: {
        query: `recording:"${trackName}" AND artist:"${artistName}"`,
        fmt: 'json',
      },
      headers: {
        'User-Agent': 'MyRadioApp/1.0.0 (myemail@example.com)',
      },
    });

    const recordings = response.data.recordings;

    if (recordings && recordings.length > 0) {
      const matchedRecording = recordings.find(
        (recording) => recording.title.toLowerCase() === trackName.toLowerCase()
      );

      if (matchedRecording && matchedRecording.length) {
        const durationMs = matchedRecording.length; // Duration in milliseconds
        const durationInSeconds = durationMs / 1000;

        // Cache the result
        cache.set(cacheKey, durationInSeconds);
        return durationInSeconds;
      }
    }

    console.warn('No matching track found in MusicBrainz.');
    return null;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      console.error('Rate limit exceeded on MusicBrainz.');
    } else {
      console.error('Error querying MusicBrainz:', error.message);
    }
    return null;
  }
};

export { getTrackDurationFromMusicBrainz };
