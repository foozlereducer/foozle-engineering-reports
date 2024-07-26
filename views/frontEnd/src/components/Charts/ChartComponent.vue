<template>
    <div ref="chartContainer" :style="{ width: '100%', height: '100%' }"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import BarChartService from '../Charts/services/BarChart.js';
  import LineChartService from '../Charts/services/LineChart.js';
  
  // Define props
  const props = defineProps({
    chartType: {
      type: String,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    }
  });
  
  const chartContainer = ref(null);
  
  const drawChart = () => {
    if (!chartContainer.value) return;
  
    switch (props.chartType) {
      case 'bar':
        BarChartService.drawChart(chartContainer.value, props.chartData);
        break;
      case 'line':
        LineChartService.drawChart(chartContainer.value, props.chartData);
        break;
      default:
        console.error('Unsupported chart type:', props.chartType);
    }
  };
  
  onMounted(drawChart);
  watch(() => [props.chartType, props.chartData], drawChart);
  </script>
  
  <style scoped>
  .bar {
    fill: rgb(44, 210, 143) !important;  /* Default color for the bars */
    stroke: slategray !important
  }
  
  .line {
    fill: none;       /* Ensure the fill is none for the line */
    stroke: steelblue;/* Default color for the line */
    stroke-width: 2px;
  }
  
  .x-axis path,
  .y-axis path {
    display: none;
  }
  
  .x-axis line,
  .y-axis line {
    stroke: #ddd;
  }
  </style>
  