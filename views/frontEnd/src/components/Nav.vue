<template>
    <nav>
        <ul v-if="isAuthenticated" v-show="!authStore.isMobile" class="navigation">
            <li><router-link class='link' :to="{ name: 'Home' }" >Home</router-link></li>
            <li><router-link class='link' :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
            <li><router-link class='link' :to="{ name: '' }" >Metrics</router-link></li>
            <li><router-link class='link' :to="{ name: '' }" >Tools</router-link></li>
        </ul> 
        <div class="icon">
            <i 
                @click="toggleMobileNav" 
                v-show="authStore.isMobile" 
                class="far fa-bars" 
                :class="{'icon-active': mobileNav}">
            </i>
            <transition name="mobile-nav" >
                <ul v-show="mobileNav" class="dropdown-nav">
                    <li>
                        <Auth @click="toggleMobileNav" class='link'/>
                    </li>
                    <li v-if="isAuthenticated"><router-link 
                        @click="toggleMobileNav"
                        class='link' :to="{ name: 'Home' 
                    }" >Home</router-link></li>
                    <li v-if="isAuthenticated"><router-link 
                        @click="toggleMobileNav" 
                        class='link' :to="{ name: 'sampleMetric' 
                    }">SampleMetric</router-link></li>
                    <li v-if="isAuthenticated"><router-link 
                        @click="toggleMobileNav" 
                        class='link' :to="{ name: '' 
                    }" >Metrics</router-link></li>
                    <li v-if="isAuthenticated"><router-link 
                        @click="toggleMobileNav"
                        class='link' :to="{ name: '' 
                    }" >Tools</router-link></li>
                </ul>
            </transition>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { ref, onMounted, onUnmounted, watch} from 'vue';
import Auth from './Auth.vue';
import {LocalStorage} from '../composables/localStorage.js';

const authStore = useAuthStore();
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const LS = new LocalStorage(authStore)
const userData = LS.getAuthData()
let mobile = ref(false);
let mobileNav = ref(false);
let isAuthenticated = ref(false)


onMounted(()=>{
isAuthenticated.value = authStore.isAuthenticated;
handler();
});

function toggleMobileNav() {
mobileNav.value = !mobileNav.value;
}

watch(() => authStore.isAuthenticated, (newValue) => {
isAuthenticated.value = newValue;
}, { immediate: true });

useWindowResize();
function handler() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;

    if (windowWidth.value <= 480) {
        // Assuming state is defined in the component's setup
        authStore.setIsMobile(true);
    } else {
         // Assuming state is defined in the component's setup
         authStore.setIsMobile(false);
        mobileNav.value = false;
    }
}

function useWindowResize() {



// Call onMounted hook
onMounted(() => {
    // Attach event listener
    window.addEventListener('resize', handler);
});

onUnmounted(() => {
    window.removeEventListener('resize', handler);
});

return (windowWidth.value, windowHeight.value)
}


</script>