// router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/Home.vue' ;
import SampleMetric from '../src/views/SampleMetric.vue';
import Login from '../src/views/Login.vue';

import { useAuthStore } from '../src/stores/authStore'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }, // Optional: Set meta data for route guarding
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/sampleMetric',
    name: 'sampleMetric',
    component: SampleMetric,
    meta: {requiresAuth: true}
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // Redirect to login page if authentication is required but user is not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

export default router;
