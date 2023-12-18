import * as jwt from 'atlassian-jwt';
import { Temporal} from '@js-temporal/polyfill';
import { ActoValidator } from '../validators/ActoValidator.js';

export class JiraRest{
    expiry;

    constructor(validator = new ActoValidator()) {
        this.validator = validator;
        this.route = '';
    }
    

    getExpiry(expiryInSeconds = 30) {
       // Get the current Date/time using Temporal
        const now = Temporal.Now.instant();
        const futureTime = now.add({seconds: expiryInSeconds});
        if ( this.validator.validate(futureTime.epochSeconds).notEmpty().num()) {
            return futureTime.epochSeconds;
        }
        
    }

    setRoute(route) {
        // if this validation fails it will throw an error; otherwise
        // the route is set
        if(this.validator.validate(route).notEmpty().String()) {
            this.route = route;
        }
    }
}