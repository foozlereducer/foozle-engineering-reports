<template>
  <div class="radio-container">
    <!-- Top Section: Audio Controls -->
    <div class="player-container">
      <div class="audio-controls-wrapper">
        <!-- AudioControls Component -->
        <AudioControls :streamUrl="selectedStreamUrl" />
      </div>
    </div>

    <!-- Middle Section: Search Filters -->
    <div class="search-section">
      <!-- StationSearch Component -->
      <StationSearch @stationsFetched="updateStations" />
    </div>

    <!-- Bottom Section: Station List -->
    <div class="station-list-section">
      <!-- StationList Component -->
      <StationList :stations="filteredStations" @playStation="playStation" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AudioControls from '../components/AudioControls.vue';
import StationSearch from '../components/StationSearch.vue';
import StationList from '../components/StationList.vue';

// Reactive state for stations list, search query, and selected stream URL
const stations = ref([]);
const searchQuery = ref('');
const selectedStreamUrl = ref('');
const filteredStations = ref([]);
const updateStations = (stations) => {
  filteredStations.value = stations;
};
// Handle fetched stations from StationSearch component
const setStations = (fetchedStations) => {
  stations.value = fetchedStations;
};

// Update search query
const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

// Set the stream URL to play a station
const playStation = (station) => {
  selectedStreamUrl.value = station.url_resolved;
};
</script>

<style scoped>
.radio-container {
  font-family: "Open Sans", serif;
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1200px;
  width:100%;
  margin: auto;
  padding: 20px;
  background: #111;
  color: #fff;
}

/* Top Section */
.player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
  padding: 20px;
  border-radius: 10px;
}

/* Middle Section */
.search-section {
  display: flex;
  justify-content: center;
  padding: 10px;
}

/* Bottom Section */
.station-list-section {
  display: flex;
  justify-content: center;
  padding: 10px;
}

@media (max-width: 768px) {
  .radio-container {
    padding: 10px;
  }

  .player-container,
  .search-section,
  .station-list-section {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
