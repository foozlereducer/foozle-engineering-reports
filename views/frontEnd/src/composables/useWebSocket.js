import { ref, onBeforeUnmount } from 'vue';
import axios from 'axios';

export function useWebSocket(currentStation, trackInfo, trackDuration, trackElapsed) {
  let ws = null;

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });

  const setupWebSocket = async () => {
    if (ws) {
      ws.close();
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${wsProtocol}//localhost:3000`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage =(event) => {
      const metadata = JSON.parse(event.data);

      if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
        trackInfo.value = metadata.currentTrack;

        if (metadata.duration) {
          trackDuration.value = metadata.duration;
          trackElapsed.value = 0;
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

    await axiosInstance.post('/api/monitor', {
      url: currentStation.value?.url_resolved,
    }).then(() => {
      console.log('Metadata monitoring started');
    }).catch((error) => {
      console.error('Failed to start metadata monitoring:', error);
    });
  };

  onBeforeUnmount(() => {
    if (ws) {
      ws.close();
    }
  });

  return {
    setupWebSocket,
  };
}
