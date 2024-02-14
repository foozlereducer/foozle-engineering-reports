import { defineStore } from 'pinia';
import { auth } from '../firebaseConfig';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
  }),
  actions: {
    signInWithGoogle() {
      const provider = new auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          this.user = result.user;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
    signOut() {
      auth.signOut()
        .then(() => {
          this.user = null;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
});
