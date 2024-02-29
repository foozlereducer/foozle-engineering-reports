<template>
    <nav>
        <ul v-if="isAuthenticated">
            <li><router-link :to="{ name: 'Home' }" >Home</router-link></li>
            <li><router-link :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
        </ul> 
        <p v-else>Not authenticated</p>
    </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { computed, watchEffect } from 'vue';
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

</script>