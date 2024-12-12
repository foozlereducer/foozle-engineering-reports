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
        <p>Now Playing: {{ trackInfo }}</p>
        <p v-if="artistName">Artist: {{ artistName }}</p>
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
const isNeonActive = ref(false); // Tracks whether the neon light is on

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
const artistName = ref('');
const albumArtUrl = ref('');

// WebSocket instance
let ws = null;

// Watch the stream URL prop and update the audio source
watch(
  () => props.streamUrl,
  (newUrl) => {
    if (audioPlayer.value) {
      isNeonActive.value = false; // Turn off the neon light initially
      audioPlayer.value.src = newUrl;
      audioPlayer.value.load(); // Load the new audio source
      if (newUrl) {
        // Automatically attempt to play the new stream
        setupWebSocket({ url_resolved: newUrl, name: 'Station' }); // Assuming station name is 'Station'
      }
    }
  }
);

// Function to attempt autoplay with user gesture fallback
const autoPlayStream = () => {
  audioPlayer.value
    .play()
    .then(() => {
      isNeonActive.value = true; // Keep the neon light on during auto-play
      console.log('Stream started automatically.');
    })
    .catch((error) => {
      console.error('Auto-play failed. User interaction required:', error);
    });
};

// Function to handle metadata loading (e.g., track duration)
const onMetadataLoaded = () => {
  if (audioPlayer.value) {
    console.log('Audio metadata loaded:', audioPlayer.value.duration);
  }
};

// Event handlers for a udio playback
const onStreamPlay = () => {
  isNeonActive.value = true; // Turn on the neon light when playing
};

const onStreamPause = () => {
  isNeonActive.value = false; // Turn off the neon light when paused
};

// Setup WebSocket to listen for metadata updates
const setupWebSocket = (station) => {
  if (ws) {
    ws.close();
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${wsProtocol}//localhost:3000`);

  ws.onopen = () => {
    console.log('WebSocket connection established');
    axiosInstance
      .post('/api/monitor', {
        url: station.url_resolved,
      })
      .then(() => {
        autoPlayStream();
        console.log('Metadata monitoring started for:', station.name);
      })
      .catch((error) => {
        console.error('Failed to start metadata monitoring:', error);
      });
  };

  ws.onmessage = (event) => {
    try {
      const metadata = JSON.parse(event.data);
      if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
        trackInfo.value = metadata.currentTrack;

        if (metadata.albumArt) {
          albumArtUrl.value = metadata.albumArt;
        }
      } else {
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
});
</script>

<style scoped>
.audio-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

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
</style>
