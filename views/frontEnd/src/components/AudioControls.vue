<template>
    <div class="audio-controls">
      <button @click="togglePlayPause">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
      <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" class="volume-slider" />
    </div>
  </template>
  
  <script setup>
  import useAudioControls from '../composables/useAudioConrols';
  
  const { isPlaying, volume, togglePlayPause, updateVolume } = useAudioControls();
  </script>
  
  <style scoped>
  .audio-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
  }
  
  .volume-slider {
    width: 150px;
  }
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
  
  button:focus {
    outline: none;
  }
  </style>
  