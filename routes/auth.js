import express from 'express';
import { 
    authSaveCookieController,
    authIsAuthenticatedController 
} from '../controllers/authController.js';
import { Auth } from '../services/auth/Auth.js'
import { verifyUser } from '../controllers/authController.js';
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
    '/v1/auth/register',
   
)


.post(
    '/v1/auth/verifyUser',
    verifyUser
)

export {router as authRouter};