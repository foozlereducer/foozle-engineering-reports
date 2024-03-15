import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { getFirebase } from '../composables/firebaseInit.js';

export const getRedirectRes = async () => {
    const firebaseApp = await getFirebase();
    const auth = getAuth(firebaseApp);

    return new Promise((resolve, reject) => {
        getRedirectResult(auth)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                const userData = {
                    token: token,
                    user: user,
                }

                resolve(userData);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
