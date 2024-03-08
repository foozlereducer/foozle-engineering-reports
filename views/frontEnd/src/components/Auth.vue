<template>
    <div class="auth" v-if="sizes.device.value == 'desktop'">
      <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
      <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
    </div> 
    <div class="mobile-auth" v-else-if="sizes.device.value == 'phone'">
      <a v-if="!isAuthenticated" @click.prevent="handleSignIn" href="#">Login</a>
      <a v-else @click.prevent="handleSignOut" href="#">Logout</a>
    </div>
</template>

<script setup>
import {useAuth} from '../composables/authentication.js'
const auth = useAuth();
const isAuthenticated = auth.isAuthenticated;
const handleSignIn = auth.handleSignIn;
const handleSignOut = auth.handleSignOut
import { createDeviceSize } from '../composables/deviceSize.js'
import {devices} from '../composables/devices.js'
const sizes = createDeviceSize(devices);
</script>

>
