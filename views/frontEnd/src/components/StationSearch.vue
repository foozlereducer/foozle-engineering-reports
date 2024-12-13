<template>
  <div class="search-container">
    <div class="search-fields">
      <!-- Country Section -->
      <div class="search-group">
        <h4>Country:</h4>
        <input
          id="searchCountry"
          v-model="searchCountry"
          class="search-input"
          placeholder="Enter country (e.g., Canada)"
          @keydown.enter="searchStations"
        />
      </div>

      <!-- Search Button -->
      <div class="search-button search-group">
        <h4>Country Search</h4>
        <button @click="searchStations" class="search-btn">Search</button>
      </div>

      <!-- Station Section -->
      <div class="search-group">
        <h4>Station:</h4>
        <input
          id="searchQuery"
          v-model="searchQuery"
          class="search-input"
          placeholder="Filter stations by name..."
          @input="updateSearchQuery"
        />
      </div>
    </div>
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
  console.log('Emitting fetched stations:', filteredStations.value);
  emit('stationsFetched', filteredStations.value);
};

// Emit search query whenever it changes
const updateSearchQuery = () => {
  emit('searchQueryUpdated', searchQuery.value);
};
</script>

<style scoped>
/* Container for the search section */
.search-container {
  width: 100%;
  margin-top: 20px;
}

/* Styling for search fields */
.search-fields {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Group for each label and input */
.search-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

/* Styling for labels (h4 elements) */
.search-group h4 {
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

/* Styling for inputs */
.search-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

/* Styling for the search button */
.search-button {
  display: flex;
  align-items: center;
}

.search-btn {
  padding: 8px 16px;
  font-size: 14px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: darkred;
}
</style>
