
import { generateToken } from '../services/auth/JWT.js';
import { Users } from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { connectDB } from '../datatabase/db.js';

export const authSaveCookieController = (Auth) => async (req, res, next) => {
    try {
        Auth.storeAuthData(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const authIsAuthenticatedController = (Auth) => async (req, res, next) => {
    try {
        Auth.isAuthenticated(req, res, next);
        res.status(200).send('Made it to the Auth controller');
    } catch (error) {
        next(error);
    }
}

export const googleLogin = async (req, res) => {
    const { googleToken, user } = req.body;

    if (!googleToken || !user) {
        return res.status(400).json({ message: 'Google token and user information are required' });
    }

    try {
        // Verify Google Token
        const decodedToken = await admin.auth().verifyIdToken(googleToken);
        const uid = decodedToken.uid;

        // Prepare JWT token with additional user information
        const jwtToken = generateToken({ uid, email: user.email, name: user.displayName });

        res.json({ jwtToken });
    } catch (err) {
        console.error('Error verifying Google token:', err.message);
        res.status(403).json({ message: 'Invalid Google token' });
    }
};

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
}

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const targetUser = await Users.find({email: email});
        // checks that the user is allowed to use the apis; only then are 
        // they allowed to register.
        if (!targetUser ) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new Users({ username, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
}
