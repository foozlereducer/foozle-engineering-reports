<template>
  <!-- Always render the LoadingSpinner but control its visibility with the loading prop -->
  <LoadingSpinner :loading="isLoading" />

  <!-- Main nav content, only visible when loading is finished -->
  <nav v-if="!isLoading">
    <ul v-if="isAuthenticated && !authStore.isMobile" class="navigation">
      <li><router-link class="link" :to="{ name: 'Home' }">Home</router-link></li>
      <li><router-link class="link" :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
      <li><router-link class="link" :to="{ name: 'Metrics' }">Metrics</router-link></li>
      <li><router-link class="link" :to="{ name: 'Tools' }">Tools</router-link></li>
      <li><router-link class="link" :to="{ name: 'Logs' }">Logs</router-link></li>
    </ul>
    <div class="icon" v-if="authStore.isMobile">
      <i
        @click="toggleMobileNav"
        class="far fa-bars"
        :class="{ 'icon-active': mobileNav }"
      ></i>
      <transition name="mobile-nav">
        <ul v-show="mobileNav" class="dropdown-nav">
          <li>
            <Auth @click="toggleMobileNav" class="link" />
          </li>
          <li v-if="isAuthenticated">
            <router-link
              @click="toggleMobileNav"
              class="link"
              :to="{ name: 'Home' }"
            >Home</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link
              @click="toggleMobileNav"
              class="link"
              :to="{ name: 'sampleMetric' }"
            >SampleMetric</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link
              @click="toggleMobileNav"
              class="link"
              :to="{ name: 'Metrics' }"
            >Metrics</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link
              @click="toggleMobileNav"
              class="link"
              :to="{ name: 'Tools' }"
            >Tools</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link
              @click="toggleMobileNav"
              class="link"
              :to="{ name: 'Logs' }"
            >Logs</router-link>
          </li>
        </ul>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Auth from './Auth.vue';
import { LocalStorage } from '../composables/localStorage.js';
import LoadingSpinner from './LoadingSpinner.vue';

// Reactive state variables
const isLoading = ref(true); // Initially set to true to show loading spinner
const authStore = useAuthStore();
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const LS = new LocalStorage(authStore);
let mobileNav = ref(false);
let isAuthenticated = ref(authStore.isAuthenticated);

// Watch for changes in authentication status
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    isAuthenticated.value = newValue;
    if (newValue) {
      isLoading.value = false; // Stop loading spinner once authenticated
    }
  },
  { immediate: true }
);

// Toggles the mobile navigation state
function toggleMobileNav() {
  mobileNav.value = !mobileNav.value;
}

// Window resize handler
useWindowResize();
function handler() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;

  if (windowWidth.value <= 480) {
    authStore.setIsMobile(true);
  } else {
    authStore.setIsMobile(false);
    mobileNav.value = false;
  }
}

// Window resize listener setup and cleanup
function useWindowResize() {
  onMounted(() => {
    window.addEventListener('resize', handler);
    handler(); // Ensure mobile state is initialized correctly on mount
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handler);
  });

  return windowWidth.value, windowHeight.value;
}

// Set loading state to false after mounted lifecycle to prevent spinner on resize
onMounted(() => {
  if (authStore.isAuthenticated) {
    isLoading.value = false;
  }
});
</script>
