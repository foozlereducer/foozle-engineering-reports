<template>
  <div class="auth" v-if="sizes.device.value == 'desktop' || sizes.device.value == 'tablet'">
    <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
    <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
  </div> 
  <div class="mobile-auth" v-else-if="sizes.device.value == 'phone'">
    <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
    <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, defineProps } from 'vue';
import { useAuth } from '../composables/authentication.js'
import { useAuthStore } from '../stores/authStore.js';
import { createDeviceSize } from '../composables/deviceSize';
import { devices } from '../composables/devices';
const auth = useAuth();
const authStore = useAuthStore();
const sizes = createDeviceSize(devices);

// Sign in / out methods
const handleSignIn = auth.handleSignIn;
const handleSignOut = auth.handleSignOut;
onMounted(()=>{
  const isAuthenticated = authStore.isAuthenticated;
  console.log('In Auth', isAuthenticated);
});


</script>