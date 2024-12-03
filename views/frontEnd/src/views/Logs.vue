<template>
  <h2>Logs</h2>
  <div class="filter-wrapper">
    <div class="date-filter">
      <label>Select a log day to view:</label>
      <input class="date" type="date" v-model="selectedDate" @change="onDateChange" />
    </div>
    <div class="time-filter">
      <label>Select time range:</label>
      <div class="time-inputs">
        <input type="time" v-model="startTime" />
        <span>to</span>
        <input type="time" v-model="endTime" />
      </div>
    </div>
    <div class="level-filter">
      <label>Select log levels to view:</label>
      <div class="level-checkboxes">
        <label v-for="level in levels" :key="level" :style="{ color: customColors[level] }">
          <input type="checkbox" v-model="selectedLevels" :value="level" />
          {{ level }}
        </label>
      </div>
    </div>
  </div>

  <div @scroll="onScroll" ref="scrollContainer" class="scroll-container">
    <div v-for="(log, index) in filteredLogs" :key="log.id" class="log-entry" :style="{ color: log.color }">
      <span>
        <div class="timestamp">{{ log.timestamp }}</div>
        <div class="level">[{{ log.level }}]</div>
        <div class="message">: {{ log.message }}</div>
      </span>
    </div>
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

// Time filters
const startTime = ref("00:00");
const endTime = ref("23:59");

// Log level filters
const levels = ["emerg", "alert", "crit", "error", "warn", "notice", "info", "debug"];
const customColors = {
  emerg: 'red',
  alert: 'orange',
  crit: 'darkred',
  error: 'red',
  warn: 'yellow',
  notice: 'cyan',
  info: 'green',
  debug: 'blue',
};
const selectedLevels = ref(["info", "debug"]); // Default selected levels

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

// Filtered logs based on time and level selection
const filteredLogs = computed(() => {
  console.log('Current selectedLevels:', selectedLevels.value);
  return logs.value.filter((log) => {
    const logTime = new Date(log.timestamp).toLocaleTimeString("en-GB", { hour12: false }).slice(0, 5);
    return (
      selectedLevels.value.includes(log.level) &&
      logTime >= startTime.value &&
      logTime <= endTime.value
    );
  });
});

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
.filter-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.date-filter,
.time-filter,
.level-filter {
  display: flex;
  flex-direction: column;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1); /* Semi-transparent background to enhance readability */
  padding: 10px; /* Padding to make the section more visually appealing */
  border-radius: 8px; /* Adds some rounded corners for better aesthetics */
}

label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 5px;
  max-width: 150px; /* Restrict the width to control wrapping */
  flex-wrap: wrap; /* Enable wrapping for the text */
  word-break: break-word; /* Allow words to break as needed */
  line-height: 1.2; /* Adjust line height for a more compact layout */
}

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
</style>

