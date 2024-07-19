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
        // Save the Google user's token and user data to mongoDB
        const sessionId = crypto.randomBytes(16).toString('hex'); // Generate a random session ID
        const authToken = new TokenModel({ sessionId, token, user });
        await authToken.save();

        // Save the sessionId as a unique key for validation purposes
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true, // set to true if you're using https
            maxAge: 60 * 60 * 4 * 1000, // expires in 4 hours
        });
        res.status(200).json({ message: 'Authentication data stored in cookie.' });
    }
    async validateSession(req, res) {
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
          return res.status(401).json({ isValid: false, message: 'No session ID provided.' });
        }
    
        const authToken = await TokenModel.findOne({ sessionId });
        if (!authToken) {
          return res.status(401).json({ isValid: false, message: 'Invalid or expired session ID.' });
        }
    
        res.status(200).json({ isValid: true, user: authToken.user });
    }

    async validateSessionMiddleware(req, res, next) {
        try {
            await this.validateSession(req, res);
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized', error: error.message });
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
