import { defineStore } from 'pinia';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import axios from 'axios';
import router from '../../router/index';



export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    auth: null, // Initialize auth property
  }),
  actions: {
    async signIn() {
      try {
        // Call your backend route to get the Firebase config
        /** TODO update this to use either the dev or prod environment */
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
        if (this.auth) {
          // Sign out the user
          await signOut(this.auth); 
          // Reset auth and isAuthenticated state after sign-out
          this.auth = null;
          this.isAuthenticated = false; // Update state to false
        }
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
  },
});
