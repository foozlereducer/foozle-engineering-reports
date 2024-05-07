import { Axios } from "axios";
import {initializeApp} from "firebase/app"
import { cookie } from "express-validator";
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

    async isAuthenticated(req, res, next) {
        try {
            res.send(req.cookies)
            const { auth } = req.cookies;
            const admin = this.initFirebaseAdmin();
            if (!auth) {
                throw new Error('Authentication cookie not found');
            }
    
            const parsedAuth = JSON.parse(auth);
            const decodedToken = await admin.auth().verifyIdToken(parsedAuth.token);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: ' + error.message });
        }
    }

    async storeAuthData(req, res) {
        console.log('req.body', req.body)
        const { token, user } = req.body;
        if (!token || !user) {
            return res.status(400).json({ message: 'Token and user data are required.' });
        }
        const userData = { auth: {token: token, user: user}}
        res.cookie('auth', JSON.stringify({ token, user }), {
            httpOnly: true,
            sameSite: 'strict',
            secure: true, // set to true if you're using https
            maxAge: 60 * 60 * 24 * 30, // expires in 4 hours
        })
        res.status(200).json({ message: 'Authentication data stored in cookie.' });
    }
}
