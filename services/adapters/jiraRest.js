import { ActoValidator } from '../validators/ActoValidator.js';
import { iApiAdapter } from './iApiAdapter.js';
import * as dotenv from 'dotenv';
import { base64Encode } from 'base64-esm'

dotenv.config();


export class JiraRest extends iApiAdapter{

    constructor(validator = new ActoValidator()) {
        super()
        this.validator = validator;
        this.route = '';
        this.httpMethod = 'GET';
    }
    
   setRoute(route, httpMethod='GET') {
        // if this validation fails it will throw an error; otherwise
        // the route is set
        if(this.validator.validate(route).notEmpty().String()) {
            this.route = route;
        }

        if(this.validator.validate(httpMethod).notEmpty().String()) {
            this.httpMethod = httpMethod;
        } else {
            this.httpMethod = 'GET';
        }
    }

    /**
     * Run Route must return a payload
     * @returns 
     */
    async runRoute() {
        const base64encodedBasicAuth = base64Encode(process.env.USERNAME + ":" + process.env.PASSWORD);
        const response = await fetch(this.route, {
            method: this.httpMethod,
            mode: 'cors',
            headers: {
               "Content-Type": "application/json",
               "Authorization": 'Basic ' + base64encodedBasicAuth
            },
        })
        return response.json();
    }

    async call(route, httpMethod='GET') {
         this.setRoute(route, httpMethod);
         return await this.runRoute();
    }
    // needed to satisfy the interface
    authenticate(){}

}