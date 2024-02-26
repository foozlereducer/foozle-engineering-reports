// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from '../router/index.js';
import { createPinia } from 'pinia';
// import './assets/css/reset.css'
// import './assets/css/mediaQueries.css'

createApp(App)
  .use(createPinia())
  .use(router) // Use the router
  .mount('#app');
