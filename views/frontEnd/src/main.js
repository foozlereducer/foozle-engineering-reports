// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from '../router/index.js';
import { createPinia } from 'pinia';
import './assets/css/reset.css'
import './assets/css/mediaQueries.css'
const app = createApp(App);
const pinia = createPinia();
app.use(router)
app.use(pinia);
try {
  app.mount('#app');
} catch(e) {
  console.error('in main.js', e);
}



  

