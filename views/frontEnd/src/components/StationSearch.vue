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


/* Container for the search section */
.search-container {
  width: 100%;
  margin-top: 20px;
}
/* Styling for search fields */
.search-fields {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

/* Desktop (1025px to 1200px) */
@media all and (min-width: 1025px) and (max-width: 1200px) {
  .search-fields {
    gap: 15px;
  }
}

/* Large Tablets and Small Computers (768px to 1024px) */
@media all and (min-width: 768px) and (max-width: 1024px) {
  .search-fields {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .search-group {
    width: 100%;
  }
}

/* Small Tablets and Large Phones (481px to 768px) */
@media all and (min-width: 481px) and (max-width: 768px) {
  .search-fields {
    grid-template-columns: 1fr;
  }
}

/* Mobile (480px and below) */
@media all and (max-width: 480px) {
  .search-fields {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
