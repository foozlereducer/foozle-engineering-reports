import * as jwt from 'atlassian-jwt';
import { Temporal} from '@js-temporal/polyfill';
import { ActoValidator } from '../validators/ActoValidator.js';
import { iApiAdapter } from './iApiAdapter.js';
import * as dotenv from 'dotenv';
dotenv.config()


export class JiraRest extends iApiAdapter{
    expiry;

    constructor(validator = new ActoValidator()) {
        super()
        this.validator = validator;
        this.route = '';
    }
    
    /**
     * Get expiry date in seconds
     * @param {num} expiryInSeconds 
     * @returns {num} - the number of expiry seconds
     */
    getExpiry(expiryInSeconds = 30) {
       // Get the current Date/time using Temporal
        const now = Temporal.Now.instant();
        let futureTime = 0;

        // ensure a defualt expiry time is set
        if(this.validator.validate(expiryInSeconds).notEmpty().num()) {
            futureTime = now.add({seconds: expiryInSeconds});
        } else {
            futureTime = now.add({seconds: 30});
        }
       
        if ( this.validator.validate(futureTime.epochSeconds).notEmpty().num()) {
            return { futureTime:futureTime.epochSeconds, now: now.epochSeconds };
        }  
    }

    setRoute(route) {
        // if this validation fails it will throw an error; otherwise
        // the route is set
        if(this.validator.validate(route).notEmpty().String()) {
            this.route = route;
        }
    }

    generateToken() {
        const ex = this.getExpiry(30);
        const expiry = ex.futureTime;
        const now = expiry.now;
        const req = jwt.fromMethodAndUrl('GET', this.route)
        const secret = process.env.JIRA_SECRET;
        const tokenData = {
            "iss": 'acto-product-and-engineering-metrics',
            "iat": now,
            "exp": expiry,
            "qsh": jwt.createQueryStringHash(req)
        }

        return jwt.encodeSymmetric(tokenData,secret)

        console.log(secret)
    }
    /**
     * Run Route must return a payload
     * @returns 
     */
    async runRoute() {
        return;
    }

    async authenticate() {

    }

}