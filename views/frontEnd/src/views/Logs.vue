<template>
  <div @scroll="onScroll" ref="scrollContainer" class="scroll-container">
    <div v-for="(log, index) in logs" :key="log.id" class="log-entry" :style="{ color: log.color }">
      <span>
        <div class="timestamp">{{ log.timestamp }}</div> 
        <div class="level">[{{ log.level }}]</div> 
        <div class="message">:{{ log.message }}</div></span>
    </div>
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const selectedDate = ref('2024-11-25'); // Replace with your actual date input logic
const logs = ref([]);
const currentPage = ref(1);
const loading = ref(false);
const totalPages = ref(0);

const pageSize = 100; // Number of logs per page
const scrollContainer = ref(null);

// Infinite scrolling logic
const fetchLogs = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${selectedDate.value}`, {
      params: {
        page: currentPage.value,
        pageSize: pageSize,
      },
    });
    logs.value = [...logs.value, ...response.data.data]; // Concatenate logs
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch logs:', error);
  }
  loading.value = false;
};

const onScroll = () => {
  const container = scrollContainer.value;

  // Check if the user scrolled near the bottom
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    if (currentPage.value < totalPages.value && !loading.value) {
      currentPage.value++;
      fetchLogs();
    }
  }
};

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.scroll-container {
  height: 600px; /* Fixed height for scrolling */
  overflow-y: auto;
}
.log-entry {
  display:block;
  white-space: pre-wrap;
}

.log-entry .timestamp {
  color:rgb(250, 226, 170);
}
.log-entry .message {
  color:rgb(250, 226, 170);
}

.log-entry span div {
  margin-right: 10px;
}
</style>
