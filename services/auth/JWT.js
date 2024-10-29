import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // ensure that the token begins with Bearer
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = { id: decoded.id, email: decoded.email }; // Select relevant information
        next();
    });
};

// Function to generate a JWT
export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};
