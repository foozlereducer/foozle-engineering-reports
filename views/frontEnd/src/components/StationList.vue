<template>
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
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import useStationSearch from '../composables/useStationSearch';
  
  const { stations, searchQuery, playStation } = useStationSearch();
  
  const filteredStations = computed(() =>
    stations.value.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
  </script>
  
  <style scoped>
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
  </style>
  