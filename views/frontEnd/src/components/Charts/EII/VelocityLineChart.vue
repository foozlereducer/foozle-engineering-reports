<template>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <div class="velocity-line-chart">
    <div class="filter">
      <label>Sprint Range:</label>
      <input v-model="startSprint" placeholder="Sprint 10" />
      <input v-model="endSprint" placeholder="Sprint 12" />
      <button @click="loadData">Load Velocity</button>
    </div>
    <div ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LineChartService from '../shared/services/LineChart.js'
import { fetchSprintVelocity, fetchCurrentSprint } from '@/services/velocityService.js'

const chartRef = ref(null)
const width = 700
const height = 300

const startSprint = ref('')
const endSprint = ref('')
const velocityData = ref([])
const errorMessage = ref('')

function getSprintRange(from, to) {
  const fromNum = parseInt(from?.match(/\d+/)?.[0])
  const toNum = parseInt(to?.match(/\d+/)?.[0])
  if (isNaN(fromNum)) return []

  const end = isNaN(toNum) ? fromNum : toNum
  return Array.from({ length: end - fromNum + 1 }, (_, i) => `Sprint ${fromNum + i}`)
}

async function loadData() {
  velocityData.value = []
  errorMessage.value = ''

  try {
    let sprintList = []

    if (!startSprint.value) {
      const { sprintName } = await fetchCurrentSprint()
      sprintList = [sprintName]
    } else {
      sprintList = getSprintRange(startSprint.value, endSprint.value)
      if (sprintList.length === 0) throw new Error('Invalid sprint range')
    }

    for (let i = 0; i < sprintList.length; i++) {
      const sprintName = sprintList[i]
      try {
        const { velocity } = await fetchSprintVelocity(sprintName)
        velocityData.value.push({
          date: new Date(2024, 0, 1 + i * 7),
          value: velocity
        })
      } catch (err) {
        console.error(`Fetch error for ${sprintName}:`, err)
        errorMessage.value = `Error loading data for ${sprintName}`
      }
    }

    LineChartService.drawChart(chartRef.value, velocityData.value, width, height)
  } catch (err) {
    console.error('loadData() error:', err)
    errorMessage.value = err.message || 'Unexpected error occurred'
  }
}

onMounted(() => {
  loadData()
})
</script>


<style scoped>
.velocity-line-chart {
  margin-top: 20px;
}
.filter {
  margin-bottom: 16px;
}
input {
  margin: 0 6px;
  padding: 4px 8px;
}
button {
  padding: 6px 10px;
}
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
</style>
