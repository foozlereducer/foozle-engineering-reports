import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';

export const applyDdosStragegies = (app) => {
    /**
     * Use rate limiting to restrict the number of requests a 
     * client can make to your server in a given time frame. 
     */
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests, please try again later.",
    });

    app.use(limiter);

    /**
     * Express-slow-down middleware to introduce delays for user 
     * who are sending a lare number of requests. This helps to 
     * deter attackers without significantly affecting legitimate users.
     */
    const speedLimiter = slowDown({
        windowMs: 15 * 60 * 1000, // 15 minutes
        delayAfter: 100, // allow 100 requests per windowMs, then start delaying responses
        delayMs: 500 // add 500ms delay to each request after the limit is reached
    });
    
    app.use(speedLimiter);
    /**
     * Using helmet to secure HTTP headers and help 
     * protect against well-known web vulnerabilities.
     */
    app.use(helmet());

    /**
     * Setting the appropriate timeouts for incoming 
     * request to ensure that slow connections 
     * cannot hold onto server resources for an extended period.
     */
    app.use((req, res, next) => {
        res.setTimeout(30000, () => {
          res.status(408).send("Request timed out"); // Set timeout to 30 seconds
        });
        next();
    });
      
}
