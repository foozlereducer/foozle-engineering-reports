<template>
    <div class="station-list">
      <div
        v-for="station in stations"
        :key="station.stationuuid"
        class="station-card"
        @click="selectStation(station)"
      >
        <p><span class="title">{{ station.name }}</span> - {{ station.country }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    stations: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['playStation']);
  
  const selectStation = (station) => {
    emit('playStation', station);
  };
  </script>
  
  <style scoped>
  .station-card {
    display: block;
    background: #333;
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    text-align: center;
  }
  
  .station-card:hover {
    background: #444;
    transform: scale(1.05);
  }
  .title {
    font-weight: bold;
    font-size: 1.2em;
  }

  .station-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Desktop (1025px to 1200px) */
@media all and (min-width: 1025px) and (max-width: 1200px) {
  .station-list {
    gap: 15px;
  }
}

/* Large Tablets and Small Computers (768px to 1024px) */
@media all and (min-width: 768px) and (max-width: 1024px) {
  .station-list {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Small Tablets and Large Phones (481px to 768px) */
@media all and (min-width: 481px) and (max-width: 768px) {
  .station-list {
    grid-template-columns: 1fr;
  }
}

/* Mobile (480px and below) */
@media all and (max-width: 480px) {
  .station-card {
    padding: 10px;
  }

  .title {
    font-size: 1em;
  }
}
  </style>
  