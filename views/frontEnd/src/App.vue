<template>
  <div v-if="loaded">
    <div class="wrapper" v-if="sizes.device.value == 'desktop'">
      <!-- Desktop -->
      <Header class="main-header"/>
      <Nav />
      <MainContent/>
      <Sideboard/>
      <Footer/>
    </div>
    <div v-else-if="sizes.device.value == 'tablet'">
      <!-- Tablet -->
      <Header />
      <Nav />
      <MainContent />
      <Sideboard />
      <Footer />
    </div>
    <div v-else-if="sizes.device.value == 'phone'">
      <!-- Mobile -->
      <Mobile />
    </div>
  </div>
  <div v-else>
    <Header class="main-header"/>
  </div>
</template>

<script setup>
import { createDeviceSize } from '../src/composables/deviceSize.js';
import { devices } from '../src/composables/devices.js';
import Mobile from './views/Mobile.vue';
import { useAuthStore } from '../src/stores/authStore';
import Icon from '../src/components/Icon.vue';
import Header from '../src/components/Header.vue';
import Nav from '../src/components/Nav.vue';
import MainContent from '../src/components/MainContent.vue';
import Sideboard from '../src/components/Sidebar.vue';
import Footer from '../src/components/Footer.vue';
import { onMounted, onBeforeMount, onUnmounted, ref, watchEffect } from 'vue';
import { LocalStorage } from './composables/localStorage.js';
import axios from 'axios';
import router from '../router';
import { navigateTo } from './composables/navigation.js';

const sizes = createDeviceSize(devices);
const loaded = ref(false);
let LS;
const authStore = useAuthStore(); // Access the auth store

LS = new LocalStorage(authStore);

// Function to determine if mobile
function checkForMobile() {
  if (true === LS.getIsMobile()) {
    sizes.device.value = 'phone';
  }
  loaded.value = true;
}

// Function to check authentication status
const checkAuthStatus = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/check-auth', { withCredentials: true });
    if (!response.data.authenticated) {
      authStore.isAuthenticated = false;
      navigateTo(router, 'Login'); // Redirect to login if not authenticated 
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
};

// Declare the intervals so they can be accessed throughout the lifecycle hooks
let authCheckInterval = null;
let intervalId = null;

onBeforeMount(() => {
  checkForMobile();
});

onMounted(async () => {
  checkForMobile();

  // Polling to check the auth status every minute
  /*
  authCheckInterval = setInterval(checkAuthStatus, 60000); // 60 seconds
  checkAuthStatus(); // Initial check on mount
  */
});

onUnmounted(() => {
  // Clear intervals when the component is unmounted
  // if (authCheckInterval) {
  //   clearInterval(authCheckInterval);
  // }
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
