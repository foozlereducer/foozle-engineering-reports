<template>
 <div v-if="loaded">
  <div class="wrapper" v-if="sizes.device.value == 'desktop'">
    <!-- Desktop -->
    <Header class="main-header"/>
    <Nav />
    <MainContent/>
    <Sideboard/>
    <Footer/>
  </div>
  <div  v-else-if="sizes.device.value == 'tablet'">
    <!-- Tablet -->
    <Header />
    <Nav />
    <MainContent />
    <Sideboard />
    <Footer />
  </div>
  <div v-else-if="sizes.device.value == 'phone'">
    <!-- Mobile -->
    <Mobile />
  </div>
</div>
<div v-else>
  <Header class="main-header"/>
</div>
</template>

<script setup>
import { createDeviceSize } from '../src/composables/deviceSize.js'
import {devices} from '../src/composables/devices.js'
const sizes = createDeviceSize(devices);
import Mobile from './views/Mobile.vue';
import { useAuthStore } from '../src/stores/authStore';
import Icon from '../src/components/Icon.vue'
import Header from '../src/components/Header.vue';
import Nav from '../src/components/Nav.vue';
import MainContent from '../src/components/MainContent.vue';
import Sideboard from '../src/components/Sidebar.vue';
import Footer from '../src/components/Footer.vue';
import { onMounted, onBeforeMount, ref, watchEffect} from 'vue';
import { LocalStorage } from './composables/localStorage.js';

let loaded = ref();
let LS;
const authStore = useAuthStore(); // Access the auth store

LS = new LocalStorage(authStore);
function checkForMobile() {
  if ( true === LS.getIsMobile()) {
    sizes.device.value = 'phone';
  }
  loaded.value = true;
  console.log('checkForMobile()', sizes.device.value);
}

onBeforeMount(() => {
    checkForMobile();
});

onMounted(async () => {
  checkForMobile() 
  const res =  await authStore.setAuthState();
  const props = {  isAuthenticated: authStore.getIsAuthenticated()}

  loaded.value = res;
  
  console.log('in App.vue', res, props.isAuthenticated)
})

watchEffect(() => {
    // Assuming setAuthState is asynchronous and might change auth state
    authStore.setAuthState().then(() => {
        loaded.value = true;
        console.log('in App.vue', authStore.getIsAuthenticated());
    });
});
</script>

