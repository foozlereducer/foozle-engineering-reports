<template>
  <h2>{{ sizes.browserWidth }} pixels: Browser</h2>
  <h2>{{ sizes.deviceWidth }} pixels: Device</h2>
  <h2>{{ sizes.device.value }} type of Device</h2>
  <hr />
  <h2>A bar chart</h2>
  <div class="chart-container">
    <ChartComponent chartType="bar" :chartData="barChartData" :chartWidth="chartWidth" :chartHeight="chartHeight" />
  </div>
  <h2>A line chart</h2>
  <div class="chart-container">
    <ChartComponent chartType="line" :chartData="lineChartData" :chartWidth="chartWidth" :chartHeight="chartHeight" />
  </div>
</template>

<script setup>
import { createDeviceSize } from '../composables/deviceSize.js';
import { devices } from '../composables/devices.js';
import { ref, onMounted } from 'vue';
import ChartComponent from '../components/Charts/ChartComponent.vue';

const sizes = createDeviceSize(devices);

// Define reactive data for the charts
const barChartData = ref([
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 }
]);

const lineChartData = ref([
  { date: new Date(2021, 0, 1), value: 30 },
  { date: new Date(2021, 1, 1), value: 80 },
  { date: new Date(2021, 2, 1), value: 45 },
  { date: new Date(2021, 3, 1), value: 60 }
]);

// Define chartWidth and chartHeight
const chartWidth = ref(0);
const chartHeight = ref(0);

// Update chart dimensions on mount
const updateChartDimensions = () => {
  chartWidth.value = window.innerWidth * 0.9; // Set width to 90% of the window width
  chartHeight.value = window.innerHeight * 0.5; // Set height to 50% of the window height
};

onMounted(() => {
  updateChartDimensions();
  window.addEventListener('resize', updateChartDimensions);
});
</script>
