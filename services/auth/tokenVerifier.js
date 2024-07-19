// tokenVerifier.js
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from './firebaseInit.js';

export const verifyToken = async (token) => {
    const admin = await initFirebaseAdmin();
    return getAuth(admin).verifyIdToken(token);
};