<template>
  <div class="dateWrapper">
    Select a log day to view: 
    <input class="date" type="date" v-model="selectedDate" @change="onDateChange" />
  </div>
  <div @scroll="onScroll" ref="scrollContainer" class="scroll-container">
    <div v-for="(log, index) in logs" :key="log.id" class="log-entry" :style="{ color: log.color }">
      <span>
        <div class="timestamp">{{ log.timestamp }}</div> 
        <div class="level">[{{ log.level }}]</div> 
        <div class="message">: {{ log.message }} </div>
      </span>
    </div>
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner.vue';

// Utility function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Set initial date to today
const today = new Date();
const selectedDate = ref(formatDate(today));

const logs = ref([]);
const currentPage = ref(1);
const loading = ref(false);
const totalPages = ref(0);

const pageSize = 100; // Number of logs per page
const scrollContainer = ref(null);

// Infinite scrolling logic
const fetchLogs = async (reset = false) => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logs/${selectedDate.value}`, {
      params: {
        page: currentPage.value,
        pageSize: pageSize,
      },
    });
    // Reset logs if fetching for a new date
    if (reset) {
      logs.value = response.data.data;
    } else {
      logs.value = [...logs.value, ...response.data.data]; // Concatenate logs
    }
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch logs:', error);
  }
  loading.value = false;
};

// Watch for date change and reset logs
const onDateChange = () => {
  currentPage.value = 1; // Reset page to 1
  fetchLogs(true); // Fetch logs for the new date and reset logs
};

// Infinite scroll event handler
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

// Initial fetching of logs
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
  display: block;
  white-space: pre-wrap;
}

.log-entry .timestamp {
  color: rgb(255, 255, 255);
}
.log-entry .message {
  color: rgb(248, 206, 154);
}

.log-entry span div {
  margin-right: 10px;
}

.dateWrapper {
  margin-bottom: 20px;
}
</style>
