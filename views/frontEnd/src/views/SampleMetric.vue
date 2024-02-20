<script setup>
import { deviceSize } from '../composables/deviceSize.js'
import HomeView from './Home.vue';
import AboutView from './About.vue'
import {devices} from '../composables/devices.js'
const sizes = deviceSize(devices)
</script>
<template>
<h2>{{ sizes.browserWidth }} pixels: Browser</h2>
  <h2>{{ sizes.deviceWidth  }} pixels: Device</h2>
  <h2>{{ sizes.device.value }} type of Device </h2>
  <AboutView v-if="sizes.device.value == 'phone'" />
  <HomeView v-else />
</template>