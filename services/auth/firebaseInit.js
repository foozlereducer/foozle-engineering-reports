// firebaseInit.js
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import axios from 'axios';

export const getFirebaseConfig = async () => {
    const response = await axios.get(process.env.URL + '/api/metrics/firebaseConfig');
    return response.data;
};

export const initFirebaseAdmin = async () => {
    const firebaseConfig = await getFirebaseConfig();
    return initializeApp({
        credential: applicationDefault(),
        databaseURL: firebaseConfig.databaseURL
    });
};
