import { ref, computed } from 'vue';
import axios from 'axios';

export function useStations() {
  const searchCountry = ref('Canada');
  const searchQuery = ref('');
  const stations = ref([]);
  const currentStation = ref(null);
  const streamUrl = ref(''); // Added streamUrl

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });

  const fetchStations = async () => {
    try {
      const response = await axiosInstance.get('/api/stations', {
        params: {
          country: searchCountry.value,
          limit: 20000,
        },
      });
      stations.value = response.data;
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const filteredStations = computed(() =>
    stations.value.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );

  const playStation = (station) => {
    currentStation.value = station;
    streamUrl.value = `${import.meta.env.VITE_BACKEND_URL}/api/stream?url=${encodeURIComponent(station.url_resolved)}`;
  };

  return {
    searchCountry,
    searchQuery,
    stations,
    filteredStations,
    currentStation,
    streamUrl, // Added to return value
    fetchStations,
    playStation,
  };
}
