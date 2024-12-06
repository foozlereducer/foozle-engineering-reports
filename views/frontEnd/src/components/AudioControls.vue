<template>
    <div class="audio-controls">
      <!-- Audio Element -->
      <audio ref="audioPlayer" :src="streamUrl" @loadedmetadata="onMetadataLoaded">
        Your browser does not support the audio element.
      </audio>
  
      <!-- Play/Pause Button -->
      <button @click="togglePlayPause">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
  
      <!-- Volume Control -->
      <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" class="volume-slider" />
  
      <!-- Track Progress (optional) -->
      <div v-if="trackDuration > 0">
        <p>Duration: {{ trackDuration }} seconds</p>
        <p>Elapsed Time: {{ trackElapsed }} seconds</p>
        <p>Progress: {{ (trackElapsed / trackDuration * 100).toFixed(2) }}%</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import useAudioControls from '../composables/useAudioControls';
  
  // Props to receive stream URL from parent
  const props = defineProps({
    streamUrl: String,
  });
  
  // Using the audio player composable
  const { audioPlayer, isPlaying, volume, togglePlayPause, updateVolume, trackDuration, trackElapsed } = useAudioControls();
  
  // Watch the stream URL prop and update the audio source
  watch(
    () => props.streamUrl,
    (newUrl) => {
      if (audioPlayer.value) {
        audioPlayer.value.src = newUrl;
        audioPlayer.value.load(); // Load the new audio source
        if (newUrl) {
          togglePlayPause(); // Automatically play the new stream
        }
      }
    }
  );
  
  // Function to handle metadata loading (e.g., track duration)
  const onMetadataLoaded = () => {
    if (audioPlayer.value) {
      console.log('Audio metadata loaded:', audioPlayer.value.duration);
    }
  };
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
  