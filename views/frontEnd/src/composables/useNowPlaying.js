// useNowPlaying.js - A composable for handling "Now Playing" information
import { ref, computed } from 'vue';

export default function useNowPlaying() {
  const currentStation = ref(null);
  const trackInfo = ref('Unknown, attempting to load...');
  const albumArtUrl = ref('');
  const trackDuration = ref(0);
  const trackElapsed = ref(0);
  const isLiveStream = ref(true);

  const progressPercentage = computed(() => {
    if (trackDuration.value > 0) {
      return Math.min((trackElapsed.value / trackDuration.value) * 100, 100);
    }
    return 0;
  });

  const formattedElapsedTime = computed(() => {
    const minutes = Math.floor(trackElapsed.value / 60);
    const seconds = Math.floor(trackElapsed.value % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  });

  const updateNowPlaying = (metadata) => {
    if (metadata.currentTrack && metadata.currentTrack !== 'Unknown') {
      trackInfo.value = metadata.currentTrack;
      if (metadata.duration) {
        trackDuration.value = metadata.duration;
      }
      if (metadata.albumArt) {
        albumArtUrl.value = metadata.albumArt;
      }
    } else {
      trackInfo.value = 'Metadata not available for this station';
    }
  };

  const resetNowPlaying = () => {
    trackInfo.value = 'Unknown, attempting to load...';
    albumArtUrl.value = '';
    trackDuration.value = 0;
    trackElapsed.value = 0;
    isLiveStream.value = true;
  };

  return {
    currentStation,
    trackInfo,
    albumArtUrl,
    trackDuration,
    trackElapsed,
    isLiveStream,
    progressPercentage,
    formattedElapsedTime,
    updateNowPlaying,
    resetNowPlaying,
  };
}
