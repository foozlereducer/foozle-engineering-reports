<template>
  <div class="radio-container">
    <h1>Radio Player</h1>
    <AudioControls :streamUrl="selectedStreamUrl" />

    <!-- Handles the stationsFetched event -->
    <StationSearch @stationsFetched="setStations" @searchQueryUpdated="updateSearchQuery" />

    <!--  Pass the filtered stations prop -->
    <StationList :stations="filteredStations" @playStation="playStation" />

   
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import StationSearch from '../components/StationSearch.vue';
import StationList from '../components/StationList.vue';
import AudioControls from '../components/AudioControls.vue';

// Reactive state for stations list, search query, and selected stream URL
const stations = ref([]);
const searchQuery = ref('');
const selectedStreamUrl = ref('');  // Define the selected stream URL
const audioPlayer = ref('')
// Function to set stations fetched from the StationSearch child component
const setStations = (fetchedStations) => {
  console.log("Received fetched stations:", fetchedStations);
  stations.value = fetchedStations;
  console.log('Stations updated in RadioPlayer:', stations.value);
};

// Function to update the search query
const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

// Computed property to filter stations by search query
const filteredStations = computed(() => {
  // Ensure stations.value is an array before attempting to filter it
  return Array.isArray(stations.value)
    ? stations.value.filter((station) =>
        station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : [];
});

// Play station function, for selecting a station to play
const playStation = (station) => {
  console.log(`Playing station: ${station.name}`);
  selectedStreamUrl.value = station.url_resolved;  // Set the URL for the audio stream
};
</script>

<style scoped>
h1 {
  text-align: left;
  margin-bottom: 10px;
}

.station-card {
  max-width: 90%;
  display: block;
}

.radio-container {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 20px;
  padding: 20px;
  color: #fff;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Desktop (1025px to 1200px) */
@media all and (min-width: 1025px) and (max-width: 1200px) {
  .radio-container {
    max-width: 90%;
    gap: 15px;
  }
}

/* Large Tablets and Small Computers (768px to 1024px) */
@media all and (min-width: 768px) and (max-width: 1024px) {
  .radio-container {
    max-width: 95%;
    gap: 15px;
  }
}

/* Small Tablets and Large Phones (481px to 768px) */
@media all and (min-width: 481px) and (max-width: 768px) {
  .radio-container {
    grid-template-rows: auto auto auto;
    gap: 10px;
    padding: 10px;
  }
}

/* Mobile (480px and below) */
@media all and (max-width: 480px) {
  .radio-container {
    padding: 8px;
    gap: 8px;
  }
}
</style>
