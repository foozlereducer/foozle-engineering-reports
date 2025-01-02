import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export function useAudioPlayer() {
  const audioPlayer = ref(null);
  const volume = ref(0.05); // Default volume set to 5%
  const isPlaying = ref(false);
  const trackDuration = ref(0);
  const progressPercentage = ref(0);
  let progressInterval = null;

  const playAudio = () => {
    if (audioPlayer.value) {
      audioPlayer.value.play();
      isPlaying.value = true;
      startProgressTracking();
    }
  };

  const pauseAudio = () => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
      stopProgressTracking();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying.value) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const updateVolume = () => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value;
    }
  };

  const startProgressTracking = () => {
    stopProgressTracking(); // Ensure no previous interval is running
    progressInterval = setInterval(() => {
      if (audioPlayer.value && !audioPlayer.value.paused) {
        // Use currentTime and duration from the audio element itself
        const elapsed = audioPlayer.value.currentTime;
        const duration = audioPlayer.value.duration;
        console.log(elapsed, duration)
        // If duration is available, calculate the percentage
        if (duration && duration > 0) {
          progressPercentage.value = Math.min((elapsed / duration) * 100, 100);
          trackDuration.value = duration;
        }
      }
    }, 1000); // Update every second
  };

  const stopProgressTracking = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  };

  onMounted(() => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value;
    }
  });

  onBeforeUnmount(() => {
    stopProgressTracking();
  });

  return {
    audioPlayer,
    volume,
    isPlaying,
    trackDuration,
    progressPercentage,
    togglePlayPause,
    updateVolume,
    startProgressTracking,
    stopProgressTracking,
  };
}
