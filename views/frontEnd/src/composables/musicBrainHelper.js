import axios from 'axios';

const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2/';

/**
 * Fetch the track duration from MusicBrainz.
 * @param {string} trackName - The name of the track to search.
 * @returns {number|null} - The duration of the track in seconds, or null if not found.
 */
export async function getTrackDurationFromMusicBrainz(trackName) {
  if (!trackName || trackName === 'Unknown') {
    console.warn('Invalid track name provided for MusicBrainz query.');
    return null;
  }

  try {
    const response = await axios.get(`${MUSICBRAINZ_BASE_URL}recording/`, {
      params: {
        query: trackName,
        fmt: 'json',
      },
    });

    if (response.data && response.data.recordings && response.data.recordings.length > 0) {
      const recording = response.data.recordings[0]; // Take the first match
      return recording.length ? Math.floor(recording.length / 1000) : null; // Convert ms to seconds
    }

    console.warn('No matching recordings found on MusicBrainz.');
    return null;
  } catch (error) {
    console.error('Error querying MusicBrainz API:', error);
    return null;
  }
}
