// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from '../router/index.js';
import { createPinia } from 'pinia';
import './assets/css/reset.css'
import './assets/css/mediaQueries.css'
import './services/axiosSetup.js';
const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router)
app.mount('#app');


  

