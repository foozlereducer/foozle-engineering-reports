import express from 'express';
import { 
    authSaveCookieController,
    authIsAuthenticatedController
} from '../controllers/authController.js';
import { Auth } from '../services/auth/Auth.js'
import { verifyUser } from '../controllers/authController.js';
import passport from 'passport';
import { generateToken } from '../services/auth/JWT.js';
import dotenv from 'dotenv';
dotenv.config();

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
    "/v1/auth/google",
    passport.authenticate('google', {scope: ["profile", "email"]})
)


.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
})

.get(
    "/google/auth/callback",
    passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to '/login' on failure
    (req, res) => {
        const user = req.user;
        const token = generateToken(user)
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: 'strict'
        });

        // On successful authentication, redirect to the desired page
        res.redirect(`${process.env.FRONT_END_URL}/home`);
    }
)
.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.id}`);
    } else {
        res.redirect('/login');
    }
})

.get(
    "/v1/auth/isAuthenticated",
    authIsAuthenticatedController(AuthService)
)


.post(
    '/v1/auth/verifyUser',
    verifyUser
)

.post('/v1/auth/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).send({ message: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid', {
                secure: true, // Match session cookie settings
                httpOnly: true,
                sameSite: 'none'
            });
            res.status(200).json({ success: true }); // Send JSON response instead of redirect
        });
    });
});


export {router as authRouter};