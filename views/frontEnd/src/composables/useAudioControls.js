import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default function useAudioControls() {
  const audioPlayer = ref(null);
  const isPlaying = ref(false);
  const volume = ref(0.05); // Set initial volume to 5%
  const trackDuration = ref(0);
  const trackElapsed = ref(0);
  const isLiveStream = ref(true);

  let progressInterval = null;
  let elapsedTimer = null;

  const togglePlayPause = async () => {
    await nextTick();
    if (audioPlayer.value) {
      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        audioPlayer.value.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      }
    } else {
      console.error('Audio player reference is NOT available when toggling play/pause.');
    }
  };

  const updateVolume = async () => {
    await nextTick();
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value;
      console.log(`Volume updated to: ${audioPlayer.value.volume}`);
    } else {
      console.error('Audio player reference is NOT available when updating volume.');
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayer.value && audioPlayer.value.duration && audioPlayer.value.duration !== Infinity) {
      trackDuration.value = audioPlayer.value.duration;
      trackElapsed.value = audioPlayer.value.currentTime;
      console.log(`Current Time: ${audioPlayer.value.currentTime}, Duration: ${audioPlayer.value.duration}`);
      isLiveStream.value = false;
    }
  };

  const handlePlaying = () => {
    console.log('Audio started playing.');
    isPlaying.value = true;

    if (isLiveStream.value) {
      startElapsedTimer();
    } else {
      startProgressTracking();
    }
  };

  const handlePause = () => {
    console.log('Audio paused.');
    isPlaying.value = false;

    if (isLiveStream.value) {
      stopElapsedTimer();
    } else {
      stopProgressTracking();
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayer.value && audioPlayer.value.duration !== Infinity) {
      trackDuration.value = audioPlayer.value.duration;
      console.log(`Loaded metadata: Duration set to ${audioPlayer.value.duration}`);
      isLiveStream.value = false;
    } else {
      isLiveStream.value = true;
    }
  };

  const startProgressTracking = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    progressInterval = setInterval(() => {
      if (trackElapsed.value < trackDuration.value) {
        trackElapsed.value += 1;
      } else {
        clearInterval(progressInterval);
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  };

  const startElapsedTimer = () => {
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
    }

    elapsedTimer = setInterval(() => {
      trackElapsed.value += 1;
    }, 1000);
  };

  const stopElapsedTimer = () => {
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
    }
  };

  onMounted(() => {
    nextTick(() => {
      if (audioPlayer.value) {
        audioPlayer.value.volume = volume.value; // Set the initial volume
        audioPlayer.value.addEventListener('timeupdate', handleTimeUpdate);
        audioPlayer.value.addEventListener('playing', handlePlaying);
        audioPlayer.value.addEventListener('pause', handlePause);
        audioPlayer.value.addEventListener('loadedmetadata', handleLoadedMetadata);
      } else {
        console.error('Audio player reference is NOT available on mounted.');
      }
    });
  });

  onBeforeUnmount(() => {
    if (audioPlayer.value) {
      audioPlayer.value.removeEventListener('timeupdate', handleTimeUpdate);
      audioPlayer.value.removeEventListener('playing', handlePlaying);
      audioPlayer.value.removeEventListener('pause', handlePause);
      audioPlayer.value.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
    stopProgressTracking();
    stopElapsedTimer();
  });

  return {
    audioPlayer,
    isPlaying,
    volume,
    trackDuration,
    trackElapsed,
    isLiveStream,
    togglePlayPause,
    updateVolume,
  };
}
