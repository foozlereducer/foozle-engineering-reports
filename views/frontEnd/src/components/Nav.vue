<template>
    <!-- Show the loading spinner when data is loading -->
    <LoadingSpinner :loading="isLoading" />
  
    <!-- Main nav content, only visible when loading is finished -->
    <nav v-if="!isLoading">
      <ul v-if="isAuthenticated" v-show="!authStore.isMobile" class="navigation">
        <li><router-link class="link" :to="{ name: 'Home' }">Home</router-link></li>
        <li><router-link class="link" :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
        <li><router-link class="link" :to="{ name: '' }">Metrics</router-link></li>
        <li><router-link class="link" :to="{ name: '' }">Tools</router-link></li>
      </ul>
      <div class="icon">
        <i
          @click="toggleMobileNav"
          v-show="authStore.isMobile"
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
                >Home</router-link
              >
            </li>
            <li v-if="isAuthenticated">
              <router-link
                @click="toggleMobileNav"
                class="link"
                :to="{ name: 'sampleMetric' }"
                >SampleMetric</router-link
              >
            </li>
            <li v-if="isAuthenticated">
              <router-link
                @click="toggleMobileNav"
                class="link"
                :to="{ name: '' }"
                >Metrics</router-link
              >
            </li>
            <li v-if="isAuthenticated">
              <router-link
                @click="toggleMobileNav"
                class="link"
                :to="{ name: '' }"
                >Tools</router-link
              >
            </li>
          </ul>
        </transition>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '../stores/authStore';
  import { ref, onMounted, onUnmounted, watch, onBeforeMount } from 'vue';
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
  
  // Called when the component mounts
  onMounted(() => {
    handler(); // Handle the initial window size to determine mobile or not
  });
  
  onBeforeMount(() => {
    isLoading.value = true;
  })
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
    });
  
    onUnmounted(() => {
      window.removeEventListener('resize', handler);
    });
  
    return windowWidth.value, windowHeight.value;
  }
  </script>
  
  <style scoped>
  /* Additional styles if necessary */
  </style>
  