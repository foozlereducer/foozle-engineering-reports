import crypto from "crypto";
import { Axios } from "axios";


import { TokenModel } from "../../models/token.js";

import dotenv from 'dotenv';
dotenv.config()

export class Auth {

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
        res.status(200).json({ message: 'Authentication data stored in cookie.' });
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
