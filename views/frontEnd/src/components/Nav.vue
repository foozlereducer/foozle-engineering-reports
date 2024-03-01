<template>
    <header :class="{'scrolled-nav':scrollPosition}">
        <nav>
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
                        <li><router-link class='link' :to="{ name: 'Home' }" >Home</router-link></li>
                        <li><router-link class='link' :to="{ name: 'sampleMetric' }">SampleMetric</router-link></li>
                        <li><router-link class='link' :to="{ name: '' }" >Metrics</router-link></li>
                        <li><router-link class='link' :to="{ name: '' }" >Tools</router-link></li>
                    </ul>
                </transition>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { computed, watchEffect } from 'vue';
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

</script>