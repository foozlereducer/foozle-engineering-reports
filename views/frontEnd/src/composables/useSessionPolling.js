// useSessionPolling.js
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import router from '../../router';

export function useSessionPolling() {
  const isAuthenticated = ref(false);
  const authStore = useAuthStore();

  // Function to check authentication status by making an API call
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/check-auth', {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        isAuthenticated.value = true;
        authStore.setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    isAuthenticated.value = false;
    authStore.setIsAuthenticated(false);
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAuthenticated: false } }));
    router.push({ name: 'Login' }); // Immediately redirect to login
  };

  // Set up polling interval
  const startPolling = () => {
    setInterval(checkAuthStatus, 60000); // Poll every 60 seconds
  };

  // Immediately check on composable usage
  checkAuthStatus();
  startPolling();

  return { checkAuthStatus, isAuthenticated };
}
