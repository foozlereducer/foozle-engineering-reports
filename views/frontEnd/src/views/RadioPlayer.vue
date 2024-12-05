<template>
  <div class="radio-container">
    <h1>Radio Player</h1>

    <div v-if="currentStation" class="now-playing">
      <h2>Now Playing: {{ currentStation.name }}</h2>
      <p>Track Info: {{ trackInfo !== 'Unknown' ? trackInfo : 'Metadata not available' }}</p>

      <!-- Album Art -->
      <div v-if="albumArtUrl" class="album-art-container">
        <img :src="albumArtUrl" alt="Album Art" class="album-art" />
      </div>

      <p v-if="!isLiveStream && trackDuration > 0">
        Progress %: {{ progressPercentage ? progressPercentage.toFixed(2) : 0 }}
      </p>

      <!-- Custom Progress Bar -->
      <div v-if="!isLiveStream && trackDuration > 0" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <!-- Timer for Live Stream -->
      <p v-if="isLiveStream">Playing Time: {{ formattedElapsedTime }}</p>

      <!-- Custom Controls -->
      <div class="audio-controls">
        <button @click="togglePlayPause">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" class="volume-slider" />
      </div>

      <audio ref="audioPlayer">
        <source :src="streamUrl" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>

    <div class="search-bar">
      <div class="search-field">
        <input v-model="searchCountry" class="searchCountry" placeholder="Enter country (e.g., Canada)" />
      </div>
      <div class="search-field search-field-station">
        <input v-model="searchQuery" placeholder="Search stations by name..." />
      </div>
      <button @click="fetchStations">Search</button>
    </div>

    <div class="station-list" v-if="stations && stations.length > 0">
      <div
        v-for="station in filteredStations"
        :key="station.stationuuid"
        class="station-card"
        @click="playStation(station)"
      >
        <h3>{{ station.name }}</h3>
        <p>Country: {{ station.country }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';

// Create an axios instance for the client-side
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Reactive state
const searchCountry = ref('Canada');
const searchQuery = ref('');
const stations = ref([]);
const currentStation = ref(null);
const streamUrl = ref('');
const trackInfo = ref('Unknown, attempting to load...');
const trackDuration = ref(0);
const trackElapsed = ref(0);
const albumArtUrl = ref(''); // Holds the URL for the album art
let progressInterval = null;
let elapsedTimer = null;
let ws = null;

const volume = ref(0.05);
const isPlaying = ref(false);
const isLiveStream = ref(true);

const audioPlayer = ref(null);

const progressPercentage = computed(() => {
  if (trackDuration.value > 0) {
    return Math.min((trackElapsed.value / trackDuration.value) * 100, 100);
  }
  return 0;
});

const formattedElapsedTime = computed(() => {
  const minutes = Math.floor(trackElapsed.value / 60);
  const seconds = Math.floor(trackElapsed.value % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// Function to fetch stations
const fetchStations = async () => {
  try {
    const response = await axiosInstance.get('/api/stations', {
      params: {
        country: searchCountry.value,
        limit: 20000,
      },
    });
    stations.value = response.data;
  } catch (error) {
    console.error('Failed to fetch stations:', error);
  }
};

const filteredStations = computed(() =>
  stations.value.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const playStation = async (station) => {
  currentStation.value = station;
  streamUrl.value = `${import.meta.env.VITE_BACKEND_URL}/api/stream?url=${encodeURIComponent(station.url_resolved)}`;
  trackElapsed.value = 0;
  trackDuration.value = 0;
  albumArtUrl.value = ''; // Reset album art URL

  await nextTick();

  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.load();

    audioPlayer.value.oncanplay = () => {
      audioPlayer.value.volume = volume.value;
      audioPlayer.value.muted = false;
      isPlaying.value = false;
      console.log('Audio can play now.');
    };

    audioPlayer.value.addEventListener('timeupdate', handleTimeUpdate);
    audioPlayer.value.addEventListener('playing', handlePlaying);
    audioPlayer.value.addEventListener('pause', handlePause);
    audioPlayer.value.addEventListener('loadedmetadata', handleLoadedMetadata);
  } else {
    console.error("Audio player reference is NOT available after nextTick.");
  }

  setupWebSocket(station);
};

const handleTimeUpdate = () => {
  if (audioPlayer.value && audioPlayer.value.duration && audioPlayer.value.duration !== Infinity) {
    trackDuration.value = audioPlayer.value.duration;
    trackElapsed.value = audioPlayer.value.currentTime;
    console.log(`Current Time: ${audioPlayer.value.currentTime}, Duration: ${audioPlayer.value.duration}`);
    isLiveStream.value = false;
  }
};

const handlePlaying = () => {
  console.log("Audio started playing.");
  isPlaying.value = true;

  if (isLiveStream.value) {
    startElapsedTimer();
  } else {
    startProgressTracking();
  }
};

const handlePause = () => {
  console.log("Audio paused.");
  isPlaying.value = false;

  if (isLiveStream.value) {
    stopElapsedTimer();
  } else {
    stopProgressTracking();
  }
};

const handleLoadedMetadata = () => {
  if (audioPlayer.value && audioPlayer.value.duration !== Infinity) {
    trackDuration.value = audioPlayer.value.duration;
    console.log(`Loaded metadata: Duration set to ${audioPlayer.value.duration}`);
    isLiveStream.value = false;
  } else {
    isLiveStream.value = true;
  }
};

const togglePlayPause = async () => {
  await nextTick();
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play().catch(error => {
        console.error("Failed to play audio:", error);
      });
    }
  } else {
    console.error("Audio player reference is NOT available when toggling play/pause.");
  }
};

const updateVolume = async () => {
  await nextTick();
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
    console.log(`Volume updated to: ${audioPlayer.value.volume}`);
  } else {
    console.error("Audio player reference is NOT available when updating volume.");
  }
};

const setupWebSocket = (station) => {
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
        albumArtUrl.value = metadata.albumArt; // Update album art URL if available
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

  axiosInstance.post('/api/monitor', {
    url: station.url_resolved,
  }).then(() => {
    console.log('Metadata monitoring started for:', station.name);
  }).catch((error) => {
    console.error('Failed to start metadata monitoring:', error);
  });
};

const startProgressTracking = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }

  progressInterval = setInterval(() => {
    if (trackElapsed.value < trackDuration.value) {
      trackElapsed.value += 1;
    } else {
      clearInterval(progressInterval);
    }
  }, 1000);
};

const stopProgressTracking = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
};

const startElapsedTimer = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer);
  }

  elapsedTimer = setInterval(() => {
    trackElapsed.value += 1;
  }, 1000);
};

const stopElapsedTimer = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer);
  }
};

onMounted(async () => {
  await nextTick();
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
    console.log(`Initial volume set to: ${audioPlayer.value.volume}`);
  } else {
    console.error("Audio player reference is NOT available on mounted");
  }
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
  }
  if (audioPlayer.value) {
    audioPlayer.value.removeEventListener('timeupdate', handleTimeUpdate);
    audioPlayer.value.removeEventListener('playing', handlePlaying);
    audioPlayer.value.removeEventListener('pause', handlePause);
    audioPlayer.value.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }
  stopProgressTracking();
  stopElapsedTimer();
});
</script>

<style scoped>
/* Styles remain unchanged */
.album-art-container {
  margin: 15px 0;
  display: flex;
  justify-content: center;
}

.album-art {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

h2, p, input {
  display: block;
}
.radio-container {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 20px;
  padding: 20px;
  color: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: left; 
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
}

.search-field {
  flex: 1;
}

.search-field-station input {
  width: 400px;
  margin-right: 5px;
}

.station-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.station-card {
  background: #333;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.station-card:hover {
  background: #444;
  transform: scale(1.05);
}

.now-playing {
  padding: 15px;
  background: #222;
  border-radius: 8px;
  text-align: center;
}

.progress-bar-container {
  display: block;
  width: 100%;
  height: 10px;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px 0;
  position: relative;
}

.progress-bar {
  display: block;
  height: 100%;
  background-color: #00ff00;
  width: 0%;
  transition: width 0.5s ease-in-out;
}

.audio-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.volume-slider {
  width: 150px;
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

audio {
  display: none; /* Hide default audio controls */
}
</style>