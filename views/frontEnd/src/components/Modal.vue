<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          <h3>{{ status }}</h3>
        </slot>
        <i @click="close" class="far fa-times-circle close-icon"></i>
      </header>
      <section class="modal-body">
        <slot name="body">
          <p>{{ message }}</p>
        </slot>
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button @click="close">Close</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useAuthStore } from '../stores/authStore.js';

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
const emit = defineEmits(['update:visible']);
const authStore = useAuthStore();

const close = () => {
  authStore.toggleModal();
  emit('update:visible', false);
};
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
  background: rgba(0,0,0, 0.5);
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
  border: 4px solid #90e5f3;
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

.modal .modal-header h3 {
  color: red;
  margin-bottom: 10px;
}

.modal .modal-header i {
  color:red;
}

.modal .modal-header i.fa-times-circle {
  font-size: 1em;
  width: 1em;
  text-align: center;
  line-height: 1em;
  background: #90e5f3;
  color: #0d0000;
  border-radius: 0.8em; /* or 50% width & line-height */
}

.modal .modal-header i.fa-times-circle:hover {
  font-size: 1em;
  width: 1em;
  text-align: center;
  line-height: 1em;
  background: #11505f;
  color: #94d2f6;
  border-radius: 0.8em; /* or 50% width & line-height */
}

.modal footer {
  display: flex;
  justify-content: flex-end;
}

.modal footer button {
  border: 3px solid #11505f;
  padding: 10px;
}

.modal footer button:hover {
  background: #11505f;
  color: #94d2f6;
}
</style>
