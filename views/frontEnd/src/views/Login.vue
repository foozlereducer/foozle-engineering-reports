<template>
  <div>
    <p>
      Please sign in.
    </p>

    <Modal v-if="showModal" :message="modalMessage" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { eventBus } from '../composables/modalEventBus.js';
import Modal from '../components/Modal.vue';

const showModal = ref(false);
const modalMessage = ref('');

// Watch for changes in the event bus
watch(eventBus.showModal, (newVal) => {
  showModal.value = newVal;
});
watch(eventBus.modalMessage, (newVal) => {
  modalMessage.value = newVal;
});
</script>


