<template>
  <div>
    <h1>Login Page</h1>
    <button @click="handleSignIn" v-if="!isAuthenticated">Sign In with Google</button>
  </div>
  <router-link :to="{ name: 'Home' }" >Home</router-link> 
  <router-link :to="{ name: 'Login' }" v-if="!isAuthenticated">| Login</router-link>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Use a computed property for isAuthenticated
const isAuthenticated = computed(() => authStore.isAuthenticated);
console.log('isAuth in Login', isAuthenticated)

const handleSignIn = async () => {
  try {
    await authStore.signIn();
  } catch (error) {
    console.error('Google sign-in failed:', error.message);
    // Handle sign-in failure
  }
};

// Check authentication state on component mount
onMounted(() => {
  if (isAuthenticated.value) {
    // Redirect to the home page if already authenticated
    router.push('/');
  }
});
</script>