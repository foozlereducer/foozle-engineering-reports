<template>
  <div ref="chartContainer" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import BarChartService from '../Charts/shared/services/BarChart.js';
import LineChartService from '../Charts/shared/services/LineChart.js';

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
let resizeObserver;
let chartHeight = ref(0);

const drawChart = () => {
  if (!chartContainer.value) return;

  const containerRect = chartContainer.value.getBoundingClientRect();
  const width = containerRect.width > 0 ? containerRect.width : 400; // Default width
  const height = chartHeight.value > 0 ? chartHeight.value : 300; // Use locked height or fallback height

  switch (props.chartType) {
    case 'bar':
      BarChartService.drawChart(chartContainer.value, props.chartData, width, height);
      break;
    case 'line':
      LineChartService.drawChart(chartContainer.value, props.chartData, width, height);
      break;
    default:
      console.error('Unsupported chart type:', props.chartType);
  }
};

onMounted(() => {
  // Set initial height based on container's height
  if (chartContainer.value) {
    chartHeight.value = chartContainer.value.getBoundingClientRect().height;
  }

  drawChart();

  // Use ResizeObserver to observe changes in chart container width only
  resizeObserver = new ResizeObserver(() => {
    if (chartContainer.value) {
      drawChart();
    }
  });

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && chartContainer.value) {
    resizeObserver.unobserve(chartContainer.value);
  }
});

watch(() => [props.chartType, props.chartData], drawChart);
</script>

<style scoped>
.bar {
  fill: rgb(44, 210, 143) !important;  /* Default color for the bars */
  stroke: slategray !important;
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
