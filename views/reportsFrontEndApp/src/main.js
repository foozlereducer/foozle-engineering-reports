import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
const app = createApp(App)

app.use(createPinia())

import router from './router'
app.use(router)

app.mount('#app')
