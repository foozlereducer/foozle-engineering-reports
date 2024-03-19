import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore.js';
import { getFirebase } from '../composables/firebaseInit.js';

export const getRedirectRes = async () => {
    const firebaseApp = await getFirebase();
    const auth = getAuth(firebaseApp);

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
                        resolve(userData);
                    } else {
                        reject(new Error('Credential is null'));
                    }
                } else {
                    reject(new Error('Result is null'));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
