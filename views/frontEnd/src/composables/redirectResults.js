import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore.js';
import { getFirebase } from '../composables/firebaseInit.js';
import { LocalStorage } from './localStorage.js';
import axios from 'axios';

const validateUser = async (eml) => {
    const verifyUserUrl = import.meta.env.VITE_BACKEND_URL + '/v1/auth/verifyUser'
    try {
        const response = await axios.post(
            verifyUserUrl,
            { "email": eml }
        )
        if (response.data && response.data.user) {
            return response.data.user === 'authenticated';
          } else {
            return { status: response.status, message: response.data.message };
          }
    } catch(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            // await logger(error.status, error, 'high', error.stack)
            return { status: error.response.status, message: 'Contact Admin' };
          } else if (error.request) {
            // The request was made but no response was received
            // await logger(error.status, error, 'high', error.stack)
            return { status: 500, message: 'No response received' };
          } else {
            // Something happened in setting up the request that triggered an Error
            // await logger(error.status, error, 'high', error.stack)
            return { status: 500, message: 'Internal Server Error' };
          }
    }
    

    if(200 !== response.status) throw new Error('Unauthorized');

    return true;
}
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
                        try {
                            await validateUser(user.email);
                        } catch(error) {
                            console.log(error, error.stack)
                        }
                        

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
