<template>
  <div class="wrapper">
    <Header class="main-header"/>
    <Nav />
    <MainContent />
    <Sideboard />
    <Footer />
  </div>
</template>
<script setup>
import { useAuthStore } from '../src/stores/authStore';
import Icon from '../src/components/Icon.vue'
import Header from '../src/components/Header.vue';
import Nav from '../src/components/Nav.vue';
import MainContent from '../src/components/MainContent.vue';
import Sideboard from '../src/components/Sidebar.vue';
import Footer from '../src/components/Footer.vue';

const authStore = useAuthStore(); // Access the auth store

const isAuthenticated = authStore.isAuthenticated; // Get the authentication state
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
