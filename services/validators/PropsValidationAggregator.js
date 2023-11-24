import { PropValidator } from "./PropValidator.js";

/**
 * Props Validation Aggregator - It will agregate all props errors that are generated
 * via the generatePropValidator(val, propName) factory.
 */
export class PropsValidationAggregator{
    constructor() {
        this.validators = [];
        this.emptyError = 'You must generate at least one PropValidator using generatePropValidator(val,propName) '
        this.status = true;
        this.errors = ''
    }

    generatePropValidator(val = false, propName = '', errorExtention = '') {
        const PV = new PropValidator(val, propName, errorExtention);
        this.validators.push(PV);
        return PV;
    }
    
    getProps() {
        if(this.validators.length === 0) {
            throw this.emptyError;
        }
        return this.validators;
    }

    processValidators() {
        let i = 0;
        if (this.validators.length > 0) {
            this.validators.forEach((pv) => {
                i++;
                this.errors += pv.getErrors();
                this.status = pv.getErrorStatus()
            })
        } else {
            throw this.emptyError;
        }
        if(0 === this.errors.length) {
            return {status: true, errors: this.errors}
        } 
    
        return {status: this.status, errors: this.errors}
    }
}