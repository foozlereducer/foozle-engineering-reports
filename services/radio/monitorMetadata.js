import icy from 'icy'; // Import the icy module
/**
 * Monitor metadata and broadcast to WebSocket clients.
 */
export const monitorMetadata = (streamUrl) => {
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
