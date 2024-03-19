<template>
        <nav :class="{'scrolled-nav':scrollPosition}">
            <ul v-if="isAuthenticated" v-show="!mobile" class="navigation">
                <li><router-link class='link' :to="{ name: 'Home' }" >Home</router-link></li>
                <li><router-link class='link' :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
                <li><router-link class='link' :to="{ name: '' }" >Metrics</router-link></li>
                <li><router-link class='link' :to="{ name: '' }" >Tools</router-link></li>
            </ul> 
            <p v-else>Not authenticated</p>
            <div class="icon">
                <i 
                    @click="toggleMobileNav" 
                    v-show="mobile" 
                    class="far fa-bars" 
                    :class="{'icon-active': mobileNav}">
                </i>
                <transition name="mobile-nav">
                    <ul v-show="mobileNav" class="dropdown-nav">
                        <li>
                            <Auth @click="toggleMobileNav" class='link'/>
                        </li>
                        <li><router-link 
                            @click="toggleMobileNav"
                            class='link' :to="{ name: 'Home' 
                        }" >Home</router-link></li>
                        <li><router-link 
                            @click="toggleMobileNav" 
                            class='link' :to="{ name: 'sampleMetric' 
                        }">SampleMetric</router-link></li>
                        <li><router-link 
                            @click="toggleMobileNav" 
                            class='link' :to="{ name: '' 
                        }" >Metrics</router-link></li>
                        <li><router-link 
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
import { useAuth } from '../composables/authentication.js'
import { ref, onMounted, onUnmounted, watchEffect} from 'vue';
import Auth from './Auth.vue';


const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const mobile = ref(false);
const mobileNav = ref(false);

function toggleMobileNav() {
    mobileNav.value = !mobileNav.value;
}

useWindowResize();

function randomizeLogin() {
    return  Math.random() < 0.5;
}

function useWindowResize() {

    function handler() {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;

        if (windowWidth.value <= 480) {
            console.log('inside 480')
            // Assuming state is defined in the component's setup
            mobile.value = true;
            console.log('mobile',mobile.value)
        } else {
             // Assuming state is defined in the component's setup
            mobile.value = false;
            mobileNav.value = false;
        }
           
       
    }

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