<script setup>
import { deviceSize } from '../composibles/deviceSize.js'
import HomeView from './HomeView.vue';
import AboutView from './AboutView.vue'
import {devices} from '../composibles/devices.js'

const sizes = deviceSize(devices)

</script>
<template>
<h2>{{ sizes.browserWidth }} pixels: Browser</h2>
  <h2>{{ sizes.deviceWidth  }} pixels: Device</h2>
  <h2>{{ sizes.device.value }} type of Device </h2>
  <AboutView v-if="sizes.device.value == 'phone'" />
  <HomeView v-else />
</template>
