<template>
  <div class="audio-controls">
    <!-- Top Row: Album Art and Now Listening -->
    <div class="top-row">
      <div class="album-art">
        <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album Art" />
      </div>
      <div class="now-listening">
        <h4 class="now-listening-title">NOW LISTENING</h4>
        <div class="under-style"></div>
        <div class="track-metadata">
          <p class="track-info">{{ trackInfo }}</p>
          <p class="artist">{{ artist }}</p>
        </div>
      </div>
    </div>

    <!-- Middle Row: Play Controls, Progress Bar, Volume -->
    <div class="middle-row">
      <button @click="togglePlayPause" class="play-button">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage.toFixed(2) + '%' }"></div>
        <div>{{ elapsedT}}</div>
      </div>

      <div class="volume-control">
        <i class="fas fa-volume-up"></i>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="updateVolume"
        />
      </div>
    </div>
  </div>

  <audio ref="audioPlayer" :src="streamUrl" @loadedmetadata="onMetadataLoaded" @play="onStreamPlay" @pause="onStreamPause">
    Your browser does not support the audio element.
  </audio>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import useAudioControls from '../composables/useAudioControls';
import { axiosInstance } from '../composables/axiosBackend';

const props = defineProps({
  streamUrl: String,
});

const {
  audioPlayer,
  isPlaying,
  volume,
  togglePlayPause,
  updateVolume,
} = useAudioControls();

const trackInfo = ref('Metadata not available for this station');
const artist = ref('Artist Unknown');
const albumArtUrl = ref('');
const duration = ref(0);
const trackStartTime = ref(0);
const progressPercentage = ref(0);
const elapsedT = ref(0); // Correct reactive variable for elapsed time

let ws = null;
let progressInterval = null;

// Watch for changes in the stream URL
watch(
  () => props.streamUrl,
  (newUrl) => {
    if (audioPlayer.value) {
      audioPlayer.value.src = newUrl;
      audioPlayer.value.load();
      if (newUrl) {
        setupWebSocket({ url_resolved: newUrl, name: 'Station' });
      }
    }
  }
);

// Start the progress bar updates
const startProgressBar = () => {
  if (progressInterval) clearInterval(progressInterval);

  progressInterval = setInterval(() => {
    const currentTime = Date.now() / 1000; // Current time in seconds
    const elapsedTime = currentTime - trackStartTime.value;
    const totalDuration = duration.value || 1; // Avoid division by zero

    if (elapsedTime >= 0 && elapsedTime <= totalDuration) {
      progressPercentage.value = Math.min((elapsedTime / totalDuration) * 100, 100);
    } else if (elapsedTime > totalDuration) {
      clearInterval(progressInterval);
      progressPercentage.value = 100;
    } else {
      progressPercentage.value = 0;
    }
    elapsedT.value = formatTime(elapsedTime); // Update elapsed time
  }, 500);
};

// Utility to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Handle different cases
    if (minutes === 0) {
        // Seconds only
        return `${remainingSeconds}s`;
    } else {
        // Minutes and seconds
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}m`;
    }
}

const onStreamPlay = () => {
  startProgressBar();
};

const onStreamPause = () => {
  clearInterval(progressInterval);
  progressPercentage.value = 0;
};

// Setup WebSocket for metadata updates
const setupWebSocket = (station) => {
  if (ws) ws.close();

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${wsProtocol}//localhost:3000`);

  ws.onopen = () => {
    axiosInstance.post('/api/monitor', { url: station.url_resolved });
  };

  ws.onmessage = (event) => {
    try {
      const metadata = JSON.parse(event.data);

      if (metadata.currentTrack) {
        trackInfo.value = metadata.currentTrack;
        artist.value = metadata.artist || 'Artist Unknown';
        albumArtUrl.value = metadata.albumArt || '';
        duration.value = metadata.duration || 0;

        // Ensure trackStartTime is set correctly
        const startTimeFromMetadata = metadata.startTime || Date.now() / 1000;
        trackStartTime.value = typeof startTimeFromMetadata === 'number' ? startTimeFromMetadata / 1000 : startTimeFromMetadata;

        // Reset progress for the new track
        progressPercentage.value = 0;
        startProgressBar();
      }
    } catch (error) {
      console.error('WebSocket Error:', error);
    }
  };

  ws.onclose = () => clearInterval(progressInterval);
};

onBeforeUnmount(() => {
  if (ws) ws.close();
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
.audio-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  color: #fff;
  width: 100%;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.album-art img {
  width: 360px;
  height: 360px;
  border-radius: 8px;
  object-fit: cover;
}

.now-listening {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.now-listening-title {
  font-size: 1em;
  font-weight: bold;
  color: #ffffff;
}

.under-style {
  width: 30px;
  height: 3px;
  background-color: #ff4444;
  margin: 5px 0;
}

.track-info {
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
}

.artist {
  font-size: 0.8em;
  color: #ccc;
}

.middle-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.play-button {
  font-size: 20px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
}

.progress-bar-container {
  flex: 1;
  height: 4px;
  background: #333;
  border-radius: 2px;
}

.progress-bar {
  display:block;
  height: 100%;
  background: #ff4444;
  transition: width 0.2s ease-in-out;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 5px;
}

.volume-control input {
  -webkit-appearance: none;
  width: 80px;
  height: 6px;
  background: #fff;
  border-radius: 5px;
}

.volume-control input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.track-metadata p {
  display: block;
}

</style>