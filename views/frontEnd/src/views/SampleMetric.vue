<template>
  <h2>A bar chart</h2>
 <div class="chart-container">
  <!-- <h2>{{ sizes.browserWidth }} pixels: Browser</h2>
    <h2>{{ sizes.deviceWidth  }} pixels: Device</h2>
    <h2>{{ sizes.device.value }} type of Device </h2> -->
    
    <ChartComponent chartType="bar" :chartData="barChartData" />
</div>
<h2>A line chart</h2>
<div class="chart-container">
    <ChartComponent chartType="line" :chartData="lineChartData" />
</div>

</template>

<script setup>
import { createDeviceSize } from '../composables/deviceSize.js'
import {devices} from '../composables/devices.js'
const sizes = createDeviceSize(devices);
import { ref } from 'vue';
import ChartComponent from '../components/Charts/ChartComponent.vue';

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
</script>
