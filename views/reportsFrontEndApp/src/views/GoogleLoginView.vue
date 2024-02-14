<template>
    <button @click="signInWithGoogle">Sign In with Google</button>
</template>
  
<script setup>
    import { useAuthStore } from '../stores/authStore'

    // Access the authentication store
    const authStore = useAuthStore();

    // Action to sign in with Google
    const signInWithGoogle = () => {
    authStore.signInWithGoogle();
};
</script>