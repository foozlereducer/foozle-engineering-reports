/**
 * Authorization Compotable
 */
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';
import { getRedirectRes } from '../composables/redirectResults.js';
import { useRouter } from 'vue-router';
import { createDeviceSize } from '../composables/deviceSize.js';
import { devices } from '../composables/devices.js';
import router from '../../router/index.js';
import { navigateTo } from './navigation.js';

export const setLogin = async () => {
  const authStore = useAuthStore(); // Access the auth store
  let isAuthenticated = ref()
  onMounted(async () => {
      const data = await getRedirectRes();
    
      if (data.token.length > 0) {
        authStore.setIsAuthenticated(true);
      }
      isAuthenticated.value = authStore.getIsAuthenticated()
  });
  watchEffect(() => {
    // Force re-render by accessing the value
    const _ = isAuthenticated.value;
    console.log(isAuthenticated.value)
  });
}



export function useAuth(isAuth=false) {
  const authStore = useAuthStore();
  let isAuthenticated = ref(false);
  if (!isAuth) {
    isAuthenticated.value = computed(() => authStore.getIsAuthenticated());
  } else {
    isAuthenticated.value = isAuth;
  }
  const router = useRouter();
  let token = ref(false);
  const sizes = ref(null);

  const getIsAuthenticated = () => {
    return isAuthenticated;
  }

  const handleSignOut = async () => {
    try {
      await authStore.signOut();
      navigateTo(router, 'Login')
    } catch (error) {
      console.error('Sign-out failed:', error.message);
      // Handle sign-out failure
    }
  };

  const handleSignIn = async () => {
    try {
      await authStore.signInWithRedirect();
      if (authStore.isAuthenticated) {
        navigateTo(router, "Home")
      } else {
        navigateTo(router, 'Login')
      }
    } catch (error) {
      console.error('Google sign-in failed:', error.message);
      // Handle sign-in failure
    }
  };

  onMounted(() => {
    sizes.value = createDeviceSize(devices);
    window.addEventListener('resize', () => {
      sizes.value = createDeviceSize(devices);
    });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      sizes.value = createDeviceSize(devices);
    });
  });

  return {
    isAuthenticated,
    token,
    handleSignIn,
    handleSignOut,
    getIsAuthenticated,
  };
}
