<template>
    <div class="auth">
      <div v-if="!isAuthenticated" >
        <a @click="handleSignIn" href="#">login</a>
    </div>
    <div v-else>
        <a @click="handleSignOut" href="#">logout</a>
    </div> 
    </div>
    
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const router = useRouter();

const handleSignOut = async () => {
  try {
    await authStore.signOut();
    router.push('/Login');
  } catch (error) {
    console.error('Sign-out failed:', error.message);
    // Handle sign-out failure
  }
};

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

>
