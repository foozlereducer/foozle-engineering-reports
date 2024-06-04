<template>
  <div>
    <h3>Home</h3>
    <Modal :visible.sync="showModal" :message="modalMessage" :status="modalStatus">
      <template v-slot:header>
        <h3>{{ modalStatus }}</h3>
      </template>
      <template v-slot:body>
        <p>{{ modalMessage }}</p>
      </template>
      <template v-slot:footer>
        <button @click="closeModal">Close</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import Modal from '../components/Modal.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  }
});

const { visible, message, status } = toRefs(props);

const close = () => {
  emit('update:visible', false);
};

const emit = defineEmits(['update:visible']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-icon {
  cursor: pointer;
  font-size: 1.5em;
}
</style>
