/**
 * Authorization Compotable
 */
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { createDeviceSize } from '../composables/deviceSize.js';
import { devices } from '../composables/devices.js';


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
      router.push('/Login');
    } catch (error) {
      console.error('Sign-out failed:', error.message);
      // Handle sign-out failure
    }
  };

  const handleSignIn = async () => {
    try {
      await authStore.signInWithRedirect();

    } catch (error) {
      console.error('Google sign-in failed:', error.message);
      // Handle sign-in failure
    }
  };

  const fadeOutLoginLogoutForWeb = () => {
    const auth = document.querySelector(".auth");
    if (sizes.value && sizes.value.browserWidth <= 480) {
      auth.classList.add('fadeLoginLogoutWeb');
    } else {
        auth.classList.remove('fadeLoginLogoutWeb');
    }
  };

  // Watch for changes to the sizes object
  watch(sizes, (newSizes) => {
    if (newSizes) {
      fadeOutLoginLogoutForWeb();
    }
  });

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
