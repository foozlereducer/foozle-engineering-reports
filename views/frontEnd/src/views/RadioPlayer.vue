<template>
  <div class="radio-container">
    <h1>Radio Player</h1>

    <div class="search-bar">
      <div class="search-field">
        <input v-model="searchCountry" class="searchCountry" placeholder="Enter country (e.g., Canada)" />
      </div>
      <div class="search-field search-field-station">
        <input v-model="searchQuery" placeholder="Search stations by name..." />
      </div>
      <button @click="fetchStations">Search</button>
    </div>

    <div class="station-list" v-if="stations.length > 0">
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

    <div v-if="currentStation" class="now-playing">
      <h2>Now Playing: {{ currentStation.name }}</h2>
      <p>Track Info: {{ trackInfo !== 'Unknown' ? trackInfo : 'Metadata not available' }}</p>
      <p>Progress %: {{ progressPercentage.toFixed(2) }}</p> <!-- Rounded to two decimal places -->
      <!-- Custom Progress Bar -->
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <!-- Custom Controls -->
      <div class="audio-controls">
        <button @click="togglePlayPause">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" class="volume-slider" />
      </div>

      <audio ref="audioPlayer" autoplay>
        <source :src="streamUrl" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, nextTick } from 'vue';
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
const trackInfo = ref('Loading...');
const trackDuration = ref(0); // Duration of the track in seconds
const trackElapsed = ref(0); // Time elapsed for the current track in seconds
let progressInterval = null; // Interval to update the progress
let ws = null; // WebSocket instance

// Volume control state
const volume = ref(0.25); // Default volume set to 25%
const isPlaying = ref(false); // State to manage if audio is playing

// Ref to the audio player element
const audioPlayer = ref(null);

// Computed property for progress percentage
const progressPercentage = computed(() => {
  if (trackDuration.value > 0) {
    return Math.min((trackElapsed.value / trackDuration.value) * 100, 100);
  }
  return 0;
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

// Computed property to filter stations by name
const filteredStations = computed(() =>
  stations.value.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Function to play a selected station
const playStation = (station) => {
  currentStation.value = station;
  streamUrl.value = `${import.meta.env.VITE_BACKEND_URL}/api/stream?url=${encodeURIComponent(station.url_resolved)}`;
  trackElapsed.value = 0; // Reset elapsed time for new track
  trackDuration.value = 240; // Temporarily setting a default duration

  // Load the audio element with the new stream
  if (audioPlayer.value) {
    audioPlayer.value.load();
    audioPlayer.value.oncanplay = () => {
      audioPlayer.value.volume = volume.value; // Set the volume to the current slider value
      audioPlayer.value.play(); // Play the audio once it's ready
      isPlaying.value = true; // Update state to playing
    };
  }

  setupWebSocket(station);
};

// Function to setup WebSocket for metadata
const setupWebSocket = (station) => {
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
    console.log('Received WebSocket event:', metadata);

    if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
      trackInfo.value = metadata.currentTrack;

      if (metadata.duration) {
        trackDuration.value = metadata.duration; // Update duration when received from metadata
        trackElapsed.value = 0; // Reset elapsed time for new track

        // Clear previous interval if exists
        if (progressInterval) {
          clearInterval(progressInterval);
        }

        // Start progress tracking
        progressInterval = setInterval(() => {
          if (trackElapsed.value < trackDuration.value) {
            trackElapsed.value += 1;
            console.log(`Track elapsed: ${trackElapsed.value}, Progress: ${progressPercentage.value}%`);
          } else {
            clearInterval(progressInterval); // Stop when track ends
          }
        }, 1000); // Update every second
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

  // Make a request to start monitoring metadata for this station
  axiosInstance.post('/api/monitor', {
    url: station.url_resolved,
  }).then(() => {
    console.log('Metadata monitoring started for:', station.name);
  }).catch((error) => {
    console.error('Failed to start metadata monitoring:', error);
  });
};

// Function to toggle play/pause
const togglePlayPause = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
      setupWebSocket(currentStation.value); // Ensure WebSocket connection is established on play
    }
    isPlaying.value = !isPlaying.value; // Toggle play state
  }
};

// Update volume using the slider
const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value; // Update the audio element's volume based on the slider
  }
};

// Clear the WebSocket connection when the component is destroyed
onBeforeUnmount(() => {
  if (ws) {
    ws.close();
  }
  if (progressInterval) {
    clearInterval(progressInterval);
  }
});
</script>

<style scoped>
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

.header {
  text-align: center;
}

.search-bar {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
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
