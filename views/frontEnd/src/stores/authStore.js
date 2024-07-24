import { defineStore } from 'pinia';
import { initializeApp } from 'firebase/app';

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
    async signInWithRedirect() {
      try {
        // Initialize Firebase app with the config
        const firebaseApp = await getFirebase();
        
        // Get the Firebase Auth instance
        this.auth = getAuth(firebaseApp); // Assign to store property

        // Create a GoogleAuthProvider instance
        const provider = new GoogleAuthProvider();
      
        signInWithRedirect(this.auth, provider) 
          .then(() => {
           
          })
          .catch((error) => {
            sendLog(401,'Error signing in with redirect.','error', error.stack)
          
          });
          this.isAuthenticated = true;
      } catch(e){
        console.error(e)
      }
    },
    async setAuthState() {
        const data = await getRedirectRes();
       
        if (data.token.length > 0 || res.isValid ) {
          this.isAuthenticated = true;
        } 

        return this.isAuthenticated;
    },
    async checkIfLoggedIn() {
      return true === this.isAuthenticated.value;
    },
    async signInPopup() {
      try {
        // Call your backend route to get the Firebase config
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/metrics/firebaseConfig');
        
        // Assuming your backend returns the Firebase config in the response.data
        const firebaseConfig = response.data;

        // Initialize Firebase app with the config
        const firebaseApp = await initializeApp(firebaseConfig);
        
        // Get the Firebase Auth instance
        this.auth = getAuth(firebaseApp); // Assign to store property

        // Create a GoogleAuthProvider instance
        const provider = new GoogleAuthProvider();

        // Sign in with Google popup
        await signInWithPopup(this.auth, provider);

        // Update isAuthenticated state after successful authentication
        this.isAuthenticated = true; // Update state to true

      } catch (error) {
        sendLog(400,'Error signing in with Google.', 'error'. error.stack)
      }
    },
    async signOut() {
      try {
        
        // Delete the auth in localstorage
        const LS = new LocalStorage(this.getThisAuth())
        LS.removeAuthData();
        this.isAuthenticated = false; // Update state to false
        axios.defaults.withCredentials = true;
          // Call the backend to clear the session cookie
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/v1/auth/logout',
          {withCredentials: true} 
        );
       
      } catch (error) {
        sendLog(400, 'Error signing out:', 'error', error.stack)
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
