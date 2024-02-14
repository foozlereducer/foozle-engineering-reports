<script setup>
import { RouterLink, RouterView } from 'vue-router'
import GoogleLoginView from './views/GoogleLoginView.vue';
</script>

<template>
  <header>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <GoogleLoginView />
  <RouterView />


</template>
  
<style scoped>
  .wrapper {
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;

  }
</style>
