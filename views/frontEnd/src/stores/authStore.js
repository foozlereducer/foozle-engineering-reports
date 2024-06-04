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
import router from '../../router/index';
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
    modalMessage: '',
    modalStatus: ''
  }),
  actions: {
    getThisAuth() {
      return this.auth;
    },
    setIsAuthenticated(state) {
      this.isAuthenticated = state;
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
    async signInWithRedirect() {
      try {
        // Initialize Firebase app with the config
        const firebaseApp = await getFirebase();
        
        // Get the Firebase Auth instance
        this.auth = getAuth(firebaseApp); // Assign to store property

        // Create a GoogleAuthProvider instance
        const provider = new GoogleAuthProvider();
      
        signInWithRedirect(this.auth, provider) 
          .then(() => {})
          .catch((error) => {
            console.error('Error signing in with redirect:', error);
            router.push('/login');
          });
      
        // Navigate to the home page after successful sign-in
        router.push('/');
      } catch(e){
        console.error(e)
         // Navigate to the home page after successful sign-in
         router.push('/login');
      }
    },
    async setAuthState(staus='401', message ='Authentication error!') {
      try {
        const data = await getRedirectRes();
        if (data.token.length > 0) {
          this.isAuthenticated = true;
        }
        return this.isAuthenticated;
      } catch (error) {
        // console.error('Error setting auth state:', error);
        await sendLog(401, 'Error setting auth state: ' + error, 'high', error.stack)
        // Set modal properties in the store to trigger the modal
        this.showModal = true;
        this.modalMessage = error.message || message;
        this.modalStatus = status; // Set status
      }
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
        console.log('isAuth in authStore', this.isAuthenticated);

         // Navigate to the home page after successful sign-in
         router.push('/');

      } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    },
    async signOut() {
      try {
        // Delete the auth in localstorage
        const LS = new LocalStorage(this.getThisAuth())
        LS.removeAuthData();
        this.isAuthenticated = false; // Update state to false
        if (this.auth) {
          // Sign out the user
          await signOut(this.auth); 
          // Reset auth and isAuthenticated state after sign-out
          this.auth = null;
        }
       
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
  },
});
