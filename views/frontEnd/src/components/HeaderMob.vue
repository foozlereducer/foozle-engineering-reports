<template>
 <header class="main-mobile-header">
        <div class="logo">
            <Icon />
        </div>
       
        <article class="sub-header">
            <h1>ACTO P&E Metrics and Tools</h1>
            <p>A set of P&E metrics and helper tools</p>
        </article>
        <Auth class="auth" />
    </header>
</template>
<script setup>
import Auth from '../components/Auth.vue'
import Icon from './Icon.vue';
</script>