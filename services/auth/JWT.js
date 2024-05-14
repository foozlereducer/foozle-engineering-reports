import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add decoded user info to the request object
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

export const generateToken = (user) => {
    return jwt.sign(
        {id: user.id, email: user.email}, 
        process.env.JWT_SECRET,
        {expiresIn: '1hr'}
    )
}
