<template>
  <div>
    <router-link :to="{ name: 'Home' }" >Home</router-link> 
    <router-link :to="{ name: 'sampleMetric' }"> | SampleMetric</router-link>
    <router-link :to="{ name: 'Login' }" v-if="!isAuthenticated"> | Login</router-link>
  </div>
  <router-view></router-view>
  
</template>
<script setup>
import { useAuthStore } from '../src/stores/authStore';

const authStore = useAuthStore(); // Access the auth store

const isAuthenticated = authStore.isAuthenticated; // Get the authentication state
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
