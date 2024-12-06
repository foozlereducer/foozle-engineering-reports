<template>
    <div class="search-bar">
      <div class="search-field">
        <input v-model="searchCountry" class="searchCountry" placeholder="Enter country (e.g., Canada)" />
      </div>
      <div class="search-field search-field-station">
        <input v-model="searchQuery" placeholder="Search stations by name..." @input="updateSearchQuery" />
      </div>
      <button @click="searchStations">Search</button>
    </div>
  </template>
  
  <script setup>
  import useStationSearch from '../composables/useStationSearch';
  
  // Import station search composable
  const { searchCountry, searchQuery, fetchStations, filteredStations } = useStationSearch();
  
  const emit = defineEmits(['stationsFetched', 'searchQueryUpdated']);
  
  // Function to handle search and fetch stations
  const searchStations = async () => {
    await fetchStations();
    console.log("Emitting fetched stations:", filteredStations.value);
    emit('stationsFetched', filteredStations.value);
  };
  
  // Emit search query whenever it changes
  const updateSearchQuery = () => {
    emit('searchQueryUpdated', searchQuery.value);
  };
  </script>
  
  <style scoped>
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
  </style>
  