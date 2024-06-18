export class Attempts {
    constructor(connectDB, AllowedModel, LoginAttemptsModel) {
        this.db = connectDB;
        this.allowed = AllowedModel;
        this.loginAttempts = LoginAttemptsModel;
    }

    async isBlocked(email) {
        const attempt = await this.loginAttempts.findOne({ email });
        if (attempt && attempt.count >= 3) {
            const currentTime = Date.now();
            const blockPeriod = 3600 * 1000; // 1 hour in milliseconds
            return (currentTime - attempt.createdAt.getTime()) < blockPeriod;
        }
        return false;
    }

    async updateAttempts(email, reset = false) {
        if (reset) {
            await this.loginAttempts.deleteOne({ email });
        } else {
            const attempt = await this.loginAttempts.findOne({ email });
            if (attempt) {
                attempt.count += 1;
                await attempt.save();
            } else {
                return await this.loginAttempts.create({ email, count: 1 });
            }
        }
    }

    async verifyUser(req, res) {
        try {
            const { email } = req.body;

            await this.db();
    
            if (await this.isBlocked(email)) {
                return res.status(403).json({ error: 'Too many failed login attempts. Please try again later.' });
            }
    
            const allowedUser = await this.allowed.findOne({ email });
    
            if (allowedUser) {
                await this.updateAttempts(email, true); // Reset attempts on successful login
                return res.status(200).json({ user: 'authenticated' });
            } else {
                await this.updateAttempts(email);
                return res.status(401).json({ user: 'unauthenticated' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Contact Admin' });
        }
    }
}