import axios from 'axios';

let spotifyAccessToken = null;
const SPOTIFY_CLIENT_ID = 'ec832d9eec4749b2baa921fe98297292';
const SPOTIFY_CLIENT_SECRET = 'cc1c1e351dc54538a9ca8c6081b8d2a9';

/**
 * Fetch Spotify access token using Client Credentials flow.
 */
export const fetchSpotifyAccessToken = async () => {
  if (spotifyAccessToken) {
    return spotifyAccessToken; // Use cached token
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    spotifyAccessToken = response.data.access_token;
    setTimeout(() => {
      spotifyAccessToken = null; // Invalidate token after expiry
    }, response.data.expires_in * 1000);

    return spotifyAccessToken;
  } catch (error) {
    console.error('Failed to fetch Spotify access token:', error.message);
    return null;
  }
};
