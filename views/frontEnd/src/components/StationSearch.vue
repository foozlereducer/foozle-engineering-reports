<template>
  <div class="search-container">
    <div class="search-fields">
      <div class="search-group">
        <label for="country">Country:</label>
        <input
          id="country"
          v-model="searchCountry"
          class="search-input"
          placeholder="Enter country"
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
.search-input {
  background-color: #333; /* Match the dark theme */
  color: #fff; /* White text for contrast */
  border: 1px solid #555; /* Subtle border for definition */
  padding: 8px;
  border-radius: 5px;
  outline: none;
}

.search-input:-webkit-autofill {
  background-color: #333 !important; /* Match the dark theme */
  -webkit-text-fill-color: #fff !important; /* Ensure autofill text is white */
  border: 1px solid #555 !important; /* Subtle border */
  -webkit-box-shadow: 0 0 0px 1000px #333 inset !important; /* Remove yellow highlight */
  box-shadow: 0 0 0px 1000px #333 inset !important; /* Remove yellow highlight */
}

.search-input:-webkit-autofill:focus {
  border-color: #ff4444 !important; /* Highlight border on focus */
  box-shadow: 0 0 5px #ff4444 !important;
  -webkit-text-fill-color: #fff !important; /* Ensure autofill text stays white */
}

.search-input:-moz-autofill {
  background-color: #333 !important; /* Match the dark theme */
  color: #fff !important; /* Ensure white text */
  border: 1px solid #555 !important; /* Subtle border */
}

.search-input:-moz-autofill:focus {
  border-color: #ff4444 !important; /* Highlight border on focus */
  box-shadow: 0 0 5px #ff4444 !important;
  color: #fff !important; /* Ensure autofill text stays white */
}

button {
  background-color: #ff4444; /* Match the button color */
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #d83a3a; /* Slightly darker red for hover effect */
}

@media (max-width: 768px) {
  .search-fields {
    grid-template-columns: 1fr;
  }
}
</style>
