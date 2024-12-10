import { fetchSpotifyAccessToken } from "./spotifyGetAccessToken.js";
import axios from 'axios';

/**
 * Fetch track metadata from Spotify.
 * @param {string} trackName - The track name.
 * @param {string} artistName - The artist name.
 * @returns {object|null} - Track metadata including duration and album art.
 */
export const fetchSpotifyTrackMetadata = async (trackName, artistName) => {
  if (!trackName || !artistName) {
    console.warn('Invalid track or artist name for Spotify search.');
    return null;
  }

  const accessToken = await fetchSpotifyAccessToken();
  if (!accessToken) {
    console.error('Unable to fetch Spotify access token.');
    return null;
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: `track:${trackName} artist:${artistName}`,
        type: 'track',
        limit: 1,
      },
    });

    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      const track = tracks[0];
      return {
        duration: track.duration_ms / 1000, // Convert ms to seconds
        albumArt: track.album.images[0]?.url, // Use correct variable `track`
      };
    } else {
      console.warn('No matching track found in Spotify.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching track metadata from Spotify:', error.message);
    return null;
  }
};
