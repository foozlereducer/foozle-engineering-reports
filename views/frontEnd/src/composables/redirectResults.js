import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore.js';
import { getFirebase } from '../composables/firebaseInit.js';
import { LocalStorage } from './localStorage.js';
import axios from 'axios';

export const getRedirectRes = async () => {
    const firebaseApp = await getFirebase();
    const auth = getAuth(firebaseApp);
    const LS = new LocalStorage(new useAuthStore())

    return new Promise((resolve, reject) => {
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if (credential) {
                        const token = credential.accessToken;
                        const user = result.user;
                        const userData = {
                            token: token,
                            user: user,
                        }
                        const saveCookieUrl = import.meta.env.VITE_BACKEND_URL + '/v1/auth/saveCookie'
                        const response = await axios.post(
                            saveCookieUrl,
                            { token, user }
                        )
            
                        if(200 !== response.status) throw new Error('Failed to store authentication data.');

                        resolve(userData);
                    } else {
                        reject(new Error('Credential is null'));
                    }
                } else {
                    const data = LS.getAuthData();
                    if (data && data.token) {
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
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
