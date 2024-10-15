import { defineStore } from 'pinia';
import { initializeApp } from 'firebase/app';
import router from '../../router/index.js';

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInWithRedirect
} from 'firebase/auth';
import axios from 'axios';
import {getFirebase} from '../composables/firebaseInit.js';
import { getRedirectRes } from '../composables/redirectResults.js';
import { LocalStorage } from '../composables/localStorage.js';
import { sendLog } from '../composables/sendLog.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    auth: null, // Initialize auth property
    isMobile: false,
    showModal: false,
    user: null
  }),
  actions: {
    getThisAuth() {
      return this.auth;
    },
    setIsAuthenticated(state) {
      this.isAuthenticated = state;
      return this.isAuthenticated;
    },
    getIsAuthenticated() {
      return this.isAuthenticated;
    },
    setIsMobile(state){
      if (null === state) {
        state = false;
      }
      this.isMobile = state
    },
    getIsMobile() {
      return this.isMobile;
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    setUser(user) {
      if( user ) {
        this.user = user;
      }
    },
    async signInWithPassport() {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/v1/auth/google',
        {withCredentials: true}
      );
      return response.data
    },
    async signOut() {
      try {
          axios.defaults.withCredentials = true;
  
          // Call the backend to clear the session cookie
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/v1/auth/logout', {}, {
              withCredentials: true,
          });
  
          if (response.status === 200 && response.data.success) {
              this.setIsAuthenticated(false);
              this.user = null;
  
              // Redirect to the Login page using Vue Router
              router.push({ name: 'Login' });
          }
      } catch (error) {
          sendLog(400, 'Error signing out:', 'error', error.stack);
          throw error;
      }
    },
    async validateSession() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + '/v1/auth/validateSession',
          {withCredentials: true}
        );
        if (response.data.isValid) {
          this.isAuthenticated = true;
          return { isValid: true, user: response.data.user };
        } else {
          this.isAuthenticated = false;
          return { isValid: false, user: null };
        }
      } catch (error) {
        sendLog(401,'Session validation failed:', 'error', error.stack)
        this.isAuthenticated = false;
        return { isValid: false, user: null };
      }
    },
  },
});
