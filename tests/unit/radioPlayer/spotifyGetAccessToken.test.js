import test from 'ava';
import nock from 'nock';
import { fetchSpotifyAccessToken } from '../../../services/spotifyGetAccessToken.js';

test('fetchSpotifyAccessToken - retrieves and caches token', async (t) => {
  nock('https://accounts.spotify.com')
    .post('/api/token')
    .reply(200, { access_token: 'token', expires_in: 3600 });

  const token = await fetchSpotifyAccessToken();
  t.is(token, 'token');
});
