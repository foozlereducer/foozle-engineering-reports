<template>
    <div v-if="currentStation" class="now-playing">
      <h2>Now Playing: {{ currentStation.name }}</h2>
      <p>Track Info: {{ trackInfo !== 'Unknown' ? trackInfo : 'Metadata not available' }}</p>
  
      <!-- Album Art -->
      <div v-if="albumArtUrl" class="album-art-container">
        <img :src="albumArtUrl" alt="Album Art" class="album-art" />
      </div>
  
      <p v-if="!isLiveStream && trackDuration > 0">
        Progress %: {{ progressPercentage ? progressPercentage.toFixed(2) : 0 }}
      </p>
  
      <!-- Custom Progress Bar -->
      <div v-if="!isLiveStream && trackDuration > 0" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>
  
      <!-- Timer for Live Stream -->
      <p v-if="isLiveStream">Playing Time: {{ formattedElapsedTime }}</p>
    </div>
  </template>
  
  <script setup>
  import useNowPlaying from '../composables/useNowPlaying';
  
  const { currentStation, trackInfo, albumArtUrl, isLiveStream, trackDuration, progressPercentage, formattedElapsedTime } = useNowPlaying();
  </script>
  
  <style scoped>
  .now-playing {
    padding: 15px;
    background: #222;
    border-radius: 8px;
    text-align: center;
  }
  
  .album-art-container {
    margin: 15px 0;
    display: flex;
    justify-content: center;
  }
  
  .album-art {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .progress-bar-container {
    display: block;
    width: 100%;
    height: 10px;
    background-color: #444;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px 0;
    position: relative;
  }
  
  .progress-bar {
    display: block;
    height: 100%;
    background-color: #00ff00;
    width: 0%;
    transition: width 0.5s ease-in-out;
  }
  </style>
  