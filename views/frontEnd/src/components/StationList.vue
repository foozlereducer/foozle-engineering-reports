<template>
  <div class="station-list">
    <p v-if="stations.length === 0" class="no-stations">No stations found.</p>
    <div
      v-for="station in stations"
      :key="station.stationuuid"
      class="station-card"
      @click="selectStation(station)"
    >
      <p>
        <span class="title">{{ station.name }}</span> - {{ station.country }}
      </p>
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

const emit = defineEmits(['playStation']); // Declare the 'playStation' event

const selectStation = (station) => {
  emit('playStation', station); // Emit the 'playStation' event
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

.no-stations {
  color: #ccc;
  text-align: center;
  font-size: 1.2em;
  margin: 20px 0;
}
</style>
