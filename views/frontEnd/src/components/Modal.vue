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
  import { toRefs } from 'vue';
  
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
  