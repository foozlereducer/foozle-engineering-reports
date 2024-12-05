import { ref } from 'vue';

export default function useWebSocketService(station) {
  const trackInfo = ref('Unknown, attempting to load...');
  const trackDuration = ref(0);
  const albumArtUrl = ref('');
  let ws = null;

  const setupWebSocket = () => {
    // Close any existing WebSocket connection
    if (ws) {
      ws.close();
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${wsProtocol}//localhost:3000`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const metadata = JSON.parse(event.data);
      if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
        trackInfo.value = metadata.currentTrack;
        if (metadata.duration) {
          trackDuration.value = metadata.duration;
        }
        if (metadata.albumArt) {
          albumArtUrl.value = metadata.albumArt;
        }
      } else {
        trackInfo.value = 'Metadata not available for this station';
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const startMonitoring = async (stationUrl) => {
    try {
      await fetch(`/api/monitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: stationUrl }),
      });
      console.log('Metadata monitoring started for:', stationUrl);
    } catch (error) {
      console.error('Failed to start metadata monitoring:', error);
    }
  };

  const closeWebSocket = () => {
    if (ws) {
      ws.close();
    }
  };

  return {
    trackInfo,
    trackDuration,
    albumArtUrl,
    setupWebSocket,
    startMonitoring,
    closeWebSocket,
  };
}
