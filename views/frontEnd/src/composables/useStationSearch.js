// useStationSearch.js
import { ref, computed } from 'vue';
import axios from 'axios';

export default function useStationSearch() {
  const searchCountry = ref('Canada');
  const searchQuery = ref('');
  const stations = ref([]);

  // Function to fetch stations based on the search criteria
  const fetchStations = async () => {
    try {
      console.log('Fetching stations for:', searchCountry.value);
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/stations', {
        params: {
          country: searchCountry.value,
          limit: 20000,
        },
      });
      stations.value = response.data;
      console.log('Stations fetched successfully:', stations.value);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  // Computed property to filter stations by country and name
  const filteredStations = computed(() => {
    return stations.value.filter((station) => {
      const matchesCountry = searchCountry.value
        ? station.country.toLowerCase().includes(searchCountry.value.toLowerCase())
        : true;
      const matchesQuery = searchQuery.value
        ? station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        : true;
      return matchesCountry && matchesQuery;
    });
  });

  return {
    searchCountry,
    searchQuery,
    stations,
    fetchStations,
    filteredStations,
  };
}
