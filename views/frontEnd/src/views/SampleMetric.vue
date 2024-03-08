<script setup>
import { createDeviceSize } from '../composables/deviceSize.js'
import {devices} from '../composables/devices.js'
const sizes = createDeviceSize(devices);
import HomeView from './Home.vue';
import Phone from './Phone.vue'
import Tablet from './Tablet.vue';
</script>

<template>

<h2>{{ sizes.browserWidth }} pixels: Browser</h2>
  <h2>{{ sizes.deviceWidth  }} pixels: Device</h2>
  <h2>{{ sizes.device.value }} type of Device </h2>

</template>