<template>
  <div class="search-container">
    <div class="search-fields">
      <div class="search-group">
        <label for="country">Country:</label>
        <input
          id="country"
          v-model="searchCountry"
          class="search-input"
          placeholder="Enter country (e.g., Canada)"
        />
      </div>
      <div class="search-group">
        <label for="station">Station:</label>
        <input
          id="station"
          v-model="searchQuery"
          class="search-input"
          placeholder="Filter stations..."
        />
      </div>
      <button @click="searchStations" class="search-btn">Search</button>
    </div>
  </div>
</template>

<script setup>
import useStationSearch from '../composables/useStationSearch';

const { searchCountry, searchQuery, fetchStations, filteredStations } =
  useStationSearch();
const emit = defineEmits(['stationsFetched']);

const searchStations = async () => {
  await fetchStations();
  emit('stationsFetched', filteredStations.value);
};
</script>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-fields {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 10px;
  align-items: center;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-btn {
  background-color: #ff4444;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.search-btn:hover {
  background-color: #e63b3b;
}

@media (max-width: 768px) {
  .search-fields {
    grid-template-columns: 1fr;
  }
}
</style>
