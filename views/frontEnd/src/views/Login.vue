<template>
  <div>
    <p>Please sign in.</p>
    <Modal :visible="showModal" message="Authentication failed" status=401 />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import Modal from '../components/Modal.vue';

const authStore = useAuthStore();
const showModal = computed(() => authStore.showModal);
</script>


