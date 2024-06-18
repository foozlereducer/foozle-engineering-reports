import express from 'express';
import { 
    authSaveCookieController,
    authIsAuthenticatedController 
} from '../controllers/authController.js';
import { Auth } from '../services/auth/Auth.js'
import { verifyUser } from '../controllers/authController.js';
import { Allowed } from '../models/allowed.js';
import { Attempts as LoginAttempts} from '../models/attempts.js';
import { Attempts } from '../services/auth/Attempts.js';
import { connectDB } from '../datatabase/db.js';

const attempts = new Attempts(connectDB, Allowed, LoginAttempts);

const router = express.Router();
const AuthService = new Auth();




/**
 * Authentication handling.
 */
// POST request to add the authentication to a httpOnly cookie

router.post(
    "/v1/auth/saveCookie", 
    authSaveCookieController(AuthService)
)

.get(
    "/v1/auth/isAuthenticated",
    authIsAuthenticatedController(AuthService)
)

.post(
    '/v1/auth/verifyUser',
    verifyUser
)

.post('/v1/auth/updateAttempts', async (req, res) => {
    try {
        const { email, reset } = req.body;
        await attempts.updateAttempts(email, reset);
        res.status(200).json({ message: 'Attempts updated successfully' });
    } catch (error) {
        console.error('Error updating attempts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

.post('/v1/auth/checkBlocked', async (req, res) => {
    try {
        const { email } = req.body;
        const isBlocked = await attempts.isBlocked(email);
        res.status(200).json({ isBlocked });
    } catch (error) {
        console.error('Error checking if blocked:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export {router as authRouter};