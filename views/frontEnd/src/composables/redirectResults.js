import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore.js';
import { getFirebase } from '../composables/firebaseInit.js';
import { LocalStorage } from './localStorage.js';
import axios from 'axios';

const validateUser = async (eml) => {
    const verifyUserUrl = import.meta.env.VITE_BACKEND_URL + '/v1/auth/verifyUser';
    try {
        const response = await axios.post(
            verifyUserUrl,
            { "email": eml }
        );
        return { status: response.status, message: response.data.message };
    } catch (error) {
        return { status: error.response.status, message: error.response.data };
    }
};

export const getRedirectRes = async () => {
    const firebaseApp = await getFirebase();
    const auth = getAuth(firebaseApp);
    const LS = new LocalStorage(new useAuthStore());
    let response;
    return new Promise((resolve, reject) => {
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if (credential) {
                        const token = credential.accessToken;
                        const user = result.user;
                        const res = await validateUser(user.email);
                        if (res.message == 'authenticated') {
                            const userData = {
                                token: token,
                                user: user,
                            };
                            const saveCookieUrl = import.meta.env.VITE_BACKEND_URL + '/v1/auth/saveCookie';
                            response = await axios.post(
                                saveCookieUrl,
                                { token, user }
                            );

                            if (response.status !== 200) throw new Error('Failed to store authentication data.');

                            resolve(userData);
                        } else {
                            const authStore = useAuthStore();
                            authStore.showModal = true;
                            authStore.modalMessage = res.message || 'Unauthenticated user';
                            authStore.status = res.status || 401;
                        }
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
                            };

                            resolve(userData);
                        } else {
                            console.log('User is not authenticated');
                        }
                    } else {
                        reject('Unauthenticated user');
                    }
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
