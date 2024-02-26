<template>
  <div>
    <h1>P&E Analytics and Tools</h1>
    <button class="">Metrics</button>
    <button class="">Tools</button>

    <button class="" @click="handleSignOut" v-if="isAuthenticated">Sign Out</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { computed } from 'vue';


const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleSignOut = async () => {
  try {
    await authStore.signOut();
  } catch (error) {
    console.error('Sign-out failed:', error.message);
    // Handle sign-out failure
  }
};
</script>