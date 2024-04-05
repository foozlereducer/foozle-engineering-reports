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
import { watchEffect } from 'vue';
import { useAuth } from '../composables/authentication.js'
import { useAuthStore } from '../stores/authStore.js';
import { createDeviceSize } from '../composables/deviceSize';
import { devices } from '../composables/devices';
import { ref } from 'vue';
const auth = useAuth();
const authStore = useAuthStore();
const sizes = createDeviceSize(devices);
let isAuthenticated = ref(false);

// Sign in / out methods
const handleSignIn = auth.handleSignIn;
const handleSignOut = auth.handleSignOut;
watchEffect(() => {
  isAuthenticated.value = authStore.getIsAuthenticated();
  console.log('In Auth', isAuthenticated.value);
});

</script>