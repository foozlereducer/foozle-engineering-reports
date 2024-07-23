import express from 'express';
import { 
    authSaveCookieController,
    authIsAuthenticatedController,
    authValidateSessionContoller,
    authLogoutController
} from '../controllers/authController.js';
import { Auth } from '../services/auth/Auth.js'
import { verifyUser } from '../controllers/authController.js';
import { TokenModel } from '../models/token.js';
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
    "/v1/auth/validateSession",
    authValidateSessionContoller(AuthService),
    (req, res) => res.status(200).json({ message: 'Session is valid', user: req.user })
)

.get(
    "/v1/auth/isAuthenticated",
    authIsAuthenticatedController(AuthService)
)


.post(
    '/v1/auth/verifyUser',
    verifyUser
)

.post(
    '/v1/auth/logout',
    authLogoutController(AuthService)
);

export {router as authRouter};