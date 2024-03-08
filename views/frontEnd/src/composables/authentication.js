/**
 * Authorization Compotable
 */
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { createDeviceSize } from '../composables/deviceSize.js';
import { devices } from '../composables/devices.js';

export function useAuth() {
  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const router = useRouter();

  const sizes = ref(null);

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
      await authStore.signIn();
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
    handleSignIn,
    handleSignOut
  };
}
