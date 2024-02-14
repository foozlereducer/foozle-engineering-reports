// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// import environment variables
/** TODO - move these to the db */
const fApiKey = import.meta.env.VITE_APP_FIREBASE_API_KEY;
console.log(fApiKey)
const fAuthDomain = import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN;
const fDbUrl = import.meta.env.VITE_APP_FIREBASE_DATABASE_URL;
const fProdId = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID;
const fStorageBucket = import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET;
const fMsgSenderId = import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID;
const fAppId = import.meta.env.VITE_APP_FIREBASE_APP_ID;

const firebaseConfig = {
    apiKey: fApiKey,
    authDomain: fAuthDomain,
    databaseURL:fDbUrl,
    projectId: fProdId,
    storageBucket: fStorageBucket,
    messagingSenderId: fMsgSenderId,
    appId: fAppId
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Get the auth setup
const auth = getAuth(firebaseApp);

export { firebaseApp, auth}