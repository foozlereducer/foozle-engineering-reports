import crypto from "crypto";
import { Axios } from "axios";
import {initializeApp} from "firebase/app"

import { TokenModel } from "../../models/token.js";

import dotenv from 'dotenv';
dotenv.config()

export class Auth {
    async initFirebaseAdmin() {
         // Call your backend route to get the Firebase config
        const response = await Axios.get(process.env.URL + '/api/metrics/firebaseConfig');
                
        // Assuming your backend returns the Firebase config in the response.data
        let firebaseConfig = response.data;
        

        // Initialize Firebase app with the config
        return await initializeApp(firebaseConfig);
    }

    async isAuthenticated(req, res) {
        try {
            const { auth } = req.cookies;
            
            if ( !auth ) {
                throw new Error('Authentication cookie not found');
            }
            
            const admin = this.initFirebaseAdmin();
            const parsedAuth = JSON.parse(auth);
            const decodedToken = await admin.auth().verifyIdToken(parsedAuth.token);
            req.user = decodedToken;
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: ' + error.message });
        }
    }

    async storeAuthData(req, res) {
        const { token, user } = req.body;
        if (!token || !user) {
            return res.status(400).json({ message: 'Token and user data are required.' });
        }

        let { sessionId } = req.cookies;
        if (sessionId) {
            const existingSession = await TokenModel.findOne({ sessionId });
            if (!existingSession) {
                sessionId = crypto.randomBytes(16).toString('hex');
            } else {
                existingSession.token = token;
                existingSession.user = user;
                await existingSession.save();
            }
        } else {
            sessionId = crypto.randomBytes(16).toString('hex');
            const authToken = new TokenModel({ sessionId, token, user });
            await authToken.save();
        }

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 60 * 4 * 1000,
            domain: 'localhost',
            path: '/',
        });
        console.log(`Cookie set: sessionId=${sessionId}`);
        res.status(200).json({ message: 'Authentication data stored in cookie.' });
    }
    async validateSession(req, res) {
        try {
            const { sessionId } = req.cookies;
            if (!sessionId) {
                return res.status(401).json({ isValid: false });
            }
            const session = await TokenModel.findOne({ sessionId });
            if (!session) {
                return res.status(401).json({ isValid: false });
            }
            res.status(200).json({ isValid: true, user: session.user });
        } catch (error) {
            res.status(500).json({ isValid: false, message: error.message });
        }
    }

    async validateSessionMiddleware(req, res, next) {
        const { sessionId } = req.cookies;
        if (!sessionId) {
            return res.status(401).json({ message: 'Session ID not found in cookies' });
        }
        try {
            const tokenRecord = await TokenModel.findOne({ sessionId });
            if (!tokenRecord) {
                return res.status(401).json({ message: 'Invalid session' });
            }
            req.user = tokenRecord.user;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logout(req, res, next){
        try {
            const { sessionId } = req.cookies;
            
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID not found in cookies' });
            }
    
            // Clean up the token and user from Mongo
            const tokenDeleteRes = await TokenModel.deleteOne({ sessionId });
        
            // Delete the sessionId cookie
            res.clearCookie('sessionId', {
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
            });
            console.log(`Cookie cleared: sessionId=${sessionId}`);
            let clearedSessionId = false;
            if (req.cookies.sessionId) {
                clearedSessionId = true;
            }
            // To be successful both the Mongo record and the cookie need to be cleared
            if( 1 == tokenDeleteRes.deletedCount && clearedSessionId) {
                res.status(200).json({ message: 'Logout successful' });
            } else {
                res.status(400).json({message: `Auth data not deleted`})
            }
        } catch (error) {
            next(error);
        }
    }
}
