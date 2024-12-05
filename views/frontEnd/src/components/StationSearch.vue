<template>
    <div class="search-bar">
      <div class="search-field">
        <input v-model="searchCountry" class="searchCountry" placeholder="Enter country (e.g., Canada)" />
      </div>
      <div class="search-field search-field-station">
        <input v-model="searchQuery" placeholder="Search stations by name..." />
      </div>
      <button @click="fetchStations">Search</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import useStationSearch from '../composables/useStationSearch';
  
  const { searchCountry, searchQuery, fetchStations } = useStationSearch();
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