<template>
  <section class="authWrapper">
    <div :class="{'fadeLoginLogoutWeb': shouldFade}" class="auth">
      <div class="auth" v-if="sizes.device.value == 'desktop' || sizes.device.value == 'tablet'">
        <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
        <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
      </div>
    
      <div class="mobile-auth" v-else-if="sizes.device.value == 'phone'">
        <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
        <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import { createDeviceSize } from '../composables/deviceSize';
import { devices } from '../composables/devices';
import { LocalStorage } from '../composables/localStorage.js';

const authStore = useAuthStore();
const sizes = createDeviceSize(devices);
let isAuthenticated = ref(false);

// Sign in / out methods
const handleSignIn = async () => {
  // Navigate directly to the backend Google OAuth route
  window.location.href = import.meta.env.VITE_BACKEND_URL + '/v1/auth/google';
};

const handleSignOut = async () => {
  await authStore.signOut();
};

const shouldFade = computed(() => sizes.value && sizes.value.browserWidth <= 480);

const LS = new LocalStorage(authStore);
function checkForMobile() {
  if (true === LS.getIsMobile()) {
    sizes.device.value = 'phone';
  }
}

onBeforeMount(() => {
  checkForMobile();
});

watchEffect(() => {
  isAuthenticated.value = authStore.getIsAuthenticated();
});
</script>
