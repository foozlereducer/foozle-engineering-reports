import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/Home.vue';
import SampleMetric from '../src/views/SampleMetric.vue';
import Login from '../src/views/Login.vue';
import Logs from '../src/views/Logs.vue';
// import Metrics from '../src/views/Metrics.vue';
// import Tools from '../src/views/Tools.vue';
import axios from 'axios';
import { useAuthStore } from '../src/stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/sampleMetric',
    name: 'sampleMetric',
    component: SampleMetric,
    meta: { requiresAuth: true },
  },
  {
    path: '/metrics',
    name: 'Metrics',
    component: '',
    meta: { requiresAuth: true },
  },
  {
    path: '/tools',
    name: 'Tools',
    component: '',
    meta: { requiresAuth: true },
  },
  {
    path: '/logs',
    name: 'Logs',
    component: Logs,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to check for authenticated users
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      try {
        // Make a request to the backend to verify the user's session
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          // If authenticated, update store and proceed to the route
          authStore.setIsAuthenticated(true);
          next();
        } else {
          // If not authenticated, redirect to login
          authStore.setIsAuthenticated(false);
          next({ name: 'Login' });
        }
      } catch (error) {
        // If an error occurs, redirect to login
        authStore.setIsAuthenticated(false);
        next({ name: 'Login' });
      }
    } else {
      next();
    }
  } else {
    // If the route does not require authentication, proceed as normal
    next();
  }
});

export default router;