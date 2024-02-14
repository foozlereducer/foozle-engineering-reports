import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {requiresAuth: true}
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/sampleMetric',
      name: 'sampleMetric',
      component: () => import('../views/SampleMetric.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/GoogleLoginView.vue'),
    },

  ]
})
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
