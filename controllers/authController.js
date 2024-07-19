
import { generateToken } from '../services/auth/JWT.js';
import { Users } from '../models/Users.js';
import { verifyAllowed } from '../services/auth/verifyAllowed.js'
import { connectDB } from '../datatabase/db.js';
import { Allowed } from '../models/allowed.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

export const authSaveCookieController = (Auth) => async (req, res, next) => {
    try {
        Auth.storeAuthData(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const authValidateSessionContoller = (Auth) => async (req, res, next) => {
    try {
        Auth.validateSession(req, res, next);
    } catch (error) {
        next(error);
    }
}

export const authLogoutController = async (req, res, next) => {
    try {
        Auth.validateSession(req, res, next);
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

export const register = async (req, res) => {
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

export const login = async (req, res) => {
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

const getMessage = (verified) => {
    if (!verified ) {
        return {status: 200, message: 'unauthorized'}
    } 
    return {status: 200, message: 'authorized'}
}

export const verifyUser = async (req, res) => {
    try {
        const {email} = req.body;
        const verified = await verifyAllowed(email, connectDB, Allowed);
        const result = getMessage(verified);
        res.status(result.status).json({ user: result.message });
    } catch (error) {
        res.status(401).json({ error: 'Verificating user failed' });
    }
    
}



