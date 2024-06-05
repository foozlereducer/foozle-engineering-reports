// router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/Home.vue' ;
import SampleMetric from '../src/views/SampleMetric.vue';
import Login from '../src/views/Login.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '../src/stores/authStore'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, // Optional: Set meta data for route guarding
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
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
