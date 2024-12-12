<template>
  <div class="audio-controls">
    <!-- Neon "ON AIR" Sign -->
    <div :class="['neon-sign', { active: isLoading }]">
      <div class="circle">
        <div class="microphone"></div>
      </div>
      <div class="text">ON AIR</div>
    </div>

    <!-- Audio Element -->
    <audio ref="audioPlayer" :src="streamUrl" @loadedmetadata="onMetadataLoaded" @timeupdate="checkLiveStream">
      Your browser does not support the audio element.
    </audio>

    <!-- Play/Pause Button -->
    <button @click="togglePlayPause">
      <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
    </button>

    <!-- Volume Control -->
    <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" class="volume-slider" />

    <!-- Track Progress and Info -->
    <div v-if="!isLiveStream">
      <p>Duration: {{ trackDuration }} seconds</p>
      <p>Elapsed Time: {{ trackElapsed.toFixed(0) }} seconds</p>
      <p>Progress: {{ ((trackElapsed / trackDuration) * 100).toFixed(2) }}%</p>
    </div>

    <!-- Show track metadata when available -->
    <div v-if="trackInfo !== 'Metadata not available for this station'">
      <p>Now Playing: {{ trackInfo }}</p>
      <p v-if="artistName">Artist: {{ artistName }}</p>
      <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album Art" />
    </div>

    <!-- Show a "LIVE" badge for live streams -->
    <div v-if="isLiveStream">
      <p class="live-indicator">LIVE</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import useAudioControls from '../composables/useAudioControls';
import { axiosInstance } from '../composables/axiosBackend';

// Props to receive stream URL from parent
const props = defineProps({
  streamUrl: String,
});

// Reactive state for "ON AIR" neon sign
const isLoading = ref(false);

// Using the audio player composable
const {
  audioPlayer,
  isPlaying,
  volume,
  togglePlayPause,
  updateVolume,
  trackDuration,
  trackElapsed,
  isLiveStream,
} = useAudioControls();

// Reactive state for track metadata
const trackInfo = ref('Metadata not available for this station');
const artistName = ref('');
const albumArtUrl = ref('');

// WebSocket instance
let ws = null;
let reconnectInterval = null;

// Watch the stream URL prop and update the audio source
watch(
  () => props.streamUrl,
  (newUrl) => {
    if (audioPlayer.value) {
      isLoading.value = true; // Neon sign turns on
      audioPlayer.value.src = newUrl;
      audioPlayer.value.load(); // Load the new audio source
      if (newUrl) {
        togglePlayPause(); // Automatically play the new stream
        setupWebSocket({ url_resolved: newUrl, name: 'Station' }); // Assuming station name is 'Station'
      }
    }
  }
);

// Function to handle metadata loading (e.g., track duration)
const onMetadataLoaded = () => {
  if (audioPlayer.value) {
    console.log('Audio metadata loaded:', audioPlayer.value.duration);
    isLiveStream.value = audioPlayer.value.duration === Infinity;
    if (!isLiveStream.value) {
      trackDuration.value = audioPlayer.value.duration;
    }
    isLoading.value = false; // Neon sign turns off
  }
};

// Function to check live stream status during playback (on every time update)
const checkLiveStream = () => {
  if (audioPlayer.value) {
    if (audioPlayer.value.duration !== Infinity) {
      isLiveStream.value = false;
      trackDuration.value = audioPlayer.value.duration;
    } else {
      isLiveStream.value = true;
    }
  }
};

// Setup WebSocket to listen for metadata updates
const setupWebSocket = (station) => {
  // Close the previous WebSocket connection if it exists
  if (ws) {
    ws.close();
  }

  // Determine WebSocket protocol based on current page
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${wsProtocol}//localhost:3000`);

  ws.onopen = () => {
    console.log('WebSocket connection established');
    // Inform the server to start monitoring metadata for this station
    axiosInstance
      .post('/api/monitor', {
        url: station.url_resolved,
      })
      .then(() => {
        console.log('Metadata monitoring started for:', station.name);
      })
      .catch((error) => {
        console.error('Failed to start metadata monitoring:', error);
      });
  };

  ws.onmessage = (event) => {
    try {
      const metadata = JSON.parse(event.data);
      console.log('Received metadata:', metadata); // Debugging received metadata

      if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
        trackInfo.value = metadata.currentTrack;

        if (metadata.duration) {
          trackDuration.value = metadata.duration;
        }

        if (metadata.albumArt) {
          albumArtUrl.value = metadata.albumArt; // Update album art URL if available
        }
      } else {
        console.log('No valid metadata available, maintaining previous state');
        trackInfo.value = 'Metadata not available for this station';
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

// Cleanup WebSocket on unmount
onBeforeUnmount(() => {
  if (ws) {
    ws.close();
  }
  if (reconnectInterval) {
    clearTimeout(reconnectInterval);
  }
});
</script>

<style scoped>
.audio-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
  text-align: center;
}

.volume-slider {
  width: 150px;
  margin: 0 auto;
}

button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

button:focus {
  outline: none;
}

.live-indicator {
  color: red;
  font-weight: bold;
  font-size: 1.2em;
}

.audio-controls img {
  width: 320px;
  height: auto;
  border-radius: 10%;
}

/* Neon Sign Styles */
.neon-sign {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
  opacity: 0.5;
  transition: opacity 0.5s ease-in-out;
}

.neon-sign.active {
  opacity: 1;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6);
}

.neon-sign .circle {
  width: 150px;
  height: 150px;
  border: 5px solid red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.1);
}

.neon-sign .microphone {
  width: 50px;
  height: 100px;
  background: red;
  position: relative;
}

.neon-sign .microphone:before {
  content: '';
  width: 30px;
  height: 10px;
  background: red;
  position: absolute;
  top: -15px;
  left: 10px;
  border-radius: 5px;
}

.neon-sign .text {
  margin-top: 10px;
  font-size: 24px;
  color: red;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}
</style>
