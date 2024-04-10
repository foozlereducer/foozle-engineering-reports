import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore.js';
import { getFirebase } from '../composables/firebaseInit.js';
import { LocalStorage } from './localStorage.js';

export const getRedirectRes = async () => {
    const firebaseApp = await getFirebase();
    const auth = getAuth(firebaseApp);
    const LS = new LocalStorage(new useAuthStore())

    return new Promise((resolve, reject) => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if (credential) {
                        const token = credential.accessToken;
                        const user = result.user;
                        const userData = {
                            token: token,
                            user: user,
                        }
                        // Save userData to local storage
                        LS.saveAuthCredentials(userData);

                        resolve(userData);
                    } else {
                        reject(new Error('Credential is null'));
                    }
                } else {
                    const data = LS.getAuthData();
                    if (data.token.length > 0) {
                        const userData = {
                            token: data.token,
                            user: data.user,
                        }

                        resolve(userData);
                    } else {
                        console.log('user is not authenticated')
                    }
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
