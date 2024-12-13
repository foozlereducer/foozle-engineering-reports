<template>
  <div class="audio-controls">
    <!-- Top Row: Controls and Neon Sign -->
    <div class="top-row">
      <div class="controls">
        <button @click="togglePlayPause">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="updateVolume"
          class="volume-slider"
        />
      </div>

      <!-- Neon "ON AIR" Sign -->
      <div :class="['neon-sign', { active: isNeonActive }]">
        <div class="circle">
          <div class="microphone"></div>
        </div>
        <div class="text">ON AIR</div>
      </div>
    </div>

    <!-- Middle Row: Album Art and Metadata -->
    <div class="middle-row">
      <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album Art" />
      <div class="now-playing">
        <div class="metadata">
          <div class="track">
            <h4>Track:</h4>
            <p>{{ trackInfo }}</p>
          </div>
          <div class="artist">
            <h4>Artist:</h4>
            <p>{{ artist }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Neon Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: progressPercentage.toFixed(2).toString() + '%' }"
        
        ><span class="pPercent">{{progressPercentage}}%</span></div>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioPlayer"
      :src="streamUrl"
      @loadedmetadata="onMetadataLoaded"
      @play="onStreamPlay"
      @pause="onStreamPause"
    >
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import useAudioControls from '../composables/useAudioControls';
import { axiosInstance } from '../composables/axiosBackend';

// Props to receive stream URL from parent
const props = defineProps({
  streamUrl: String,
});

// Reactive state for "ON AIR" neon sign
const isNeonActive = ref(false);

// Using the audio player composable
const {
  audioPlayer,
  isPlaying,
  volume,
  togglePlayPause,
  updateVolume,
} = useAudioControls();

// Reactive state for track metadata
const trackInfo = ref('Metadata not available for this station');
const artist = ref('Artist Unknown');
const albumArtUrl = ref('');
const duration = ref(0);
const startTime = ref(0);
const progressPercentage = ref(0);

let ws = null;
let progressInterval = null;

// Watch the stream URL prop and update the audio source
watch(
  () => props.streamUrl,
  (newUrl) => {
    if (audioPlayer.value) {
      isNeonActive.value = false;
      audioPlayer.value.src = newUrl;
      audioPlayer.value.load();
      if (newUrl) {
        setupWebSocket({ url_resolved: newUrl, name: 'Station' });
      }
    }
  }
);

// Start progress bar updates
const startProgressBar = () => {
  if (progressInterval) clearInterval(progressInterval);

  progressInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime.value;

    if (elapsedTime >= duration.value) {
      clearInterval(progressInterval);
      progressPercentage.value = 100;
    } else {
      progressPercentage.value = Math.min(((elapsedTime / duration.value) * 100).toFixed(2), 100);
    }
  }, 1000);
};

const autoPlayStream = () => {
  audioPlayer.value
    .play()
    .then(() => {
      isNeonActive.value = true;
    })
    .catch((error) => {
      console.error('Auto-play failed. User interaction required:', error);
    });
};

// Audio playback events
const onStreamPlay = () => {
  isNeonActive.value = true;
  startProgressBar();
};

const onStreamPause = () => {
  isNeonActive.value = false;
  clearInterval(progressInterval);
};

// Setup WebSocket to listen for metadata updates
const setupWebSocket = (station) => {
  if (ws) {
    ws.close();
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${wsProtocol}//localhost:3000`);

  ws.onopen = () => {
    axiosInstance
      .post('/api/monitor', { url: station.url_resolved })
      .then(() => autoPlayStream());
  };

  ws.onmessage = (event) => {
    try {
      const metadata = JSON.parse(event.data);
      if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
        trackInfo.value = metadata.currentTrack;
        artist.value = metadata.artist || 'Artist Unknown';
        albumArtUrl.value = metadata.albumArt || '';
        duration.value = (metadata.duration || 0) * 1000;
        startTime.value = metadata.startTime || 0;
        startProgressBar();
      } else {
        trackInfo.value = 'Metadata not available for this station';
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onclose = () => {
    if (progressInterval) clearInterval(progressInterval);
  };
};

// Cleanup WebSocket and interval on unmount
onBeforeUnmount(() => {
  if (ws) ws.close();
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
.top-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.middle-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.audio-controls img {
  width: 150px;
  height: auto;
  border-radius: 10%;
}

/* Neon Sign */
.neon-sign {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.5s ease-in-out;
}

.neon-sign.active {
  opacity: 1;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6);
}

.neon-sign .circle {
  width: 100px;
  height: 100px;
  border: 5px solid red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.1);
}

.neon-sign .microphone {
  width: 30px;
  height: 60px;
  background: red;
  position: relative;
}

.neon-sign .microphone:before {
  content: '';
  width: 20px;
  height: 5px;
  background: red;
  position: absolute;
  top: -10px;
  left: 5px;
  border-radius: 5px;
}

.neon-sign .text {
  margin-top: 5px;
  font-size: 18px;
  color: red;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}

/* Neon Progress Bar */
.progress-bar-container {
  width: 100%;
  max-width: 500px;
  height: 20px;
  background-color: #111;
  border: 2px solid red;
  border-radius: 10px;
  margin: 10px 0;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-bar-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 0, 0, 0.8), rgba(173, 1, 1, 0.8));
  width: 0%;
  transition: width 0.2s ease-in-out;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6); /* Neon red glow */
}
.pPercent {
  display:block;
  font-size: 0.6em;
  text-align: center;
}
/* Metadata grid */
.metadata {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.track,
.artist {
  text-align: center;
}

.track h4,
.artist h4 {
  display: block;
  margin: 0;
  font-size: 16px;
  color: #fff;
}

.track p,
.artist p {
  margin: 0;
  font-size: 14px;
  color: #aaa;
  word-wrap: break-word;
  text-align: center;
}

.audio-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

/* Desktop (1025px to 1200px) */
@media all and (min-width: 1025px) and (max-width: 1200px) {
  .audio-controls {
    gap: 15px;
  }
}

/* Large Tablets and Small Computers (768px to 1024px) */
@media all and (min-width: 768px) and (max-width: 1024px) {
  .audio-controls {
    gap: 10px;
  }

  .top-row {
    flex-direction: column;
    gap: 10px;
  }

  .middle-row {
    flex-direction: column;
    text-align: center;
  }
}

/* Small Tablets and Large Phones (481px to 768px) */
@media all and (min-width: 481px) and (max-width: 768px) {
  .audio-controls img {
    width: 80%;
    max-width: 250px;
  }
}

/* Mobile (480px and below) */
@media all and (max-width: 480px) {
  .audio-controls img {
    width: 100%;
    max-width: 200px;
  }

  .progress-bar-container {
    width: 100%;
  }

  .neon-sign {
    flex-direction: column;
    align-items: center;
  }
}
</style>
