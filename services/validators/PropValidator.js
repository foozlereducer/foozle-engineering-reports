/**
 * Class Props Validator - verified the mongoose schema properties in this app
 */
export class PropValidator {
    /**
     * Constructor
     * @param {mixed} val 
     * @param {String} propName 
     * @param {String} errors 
     */
    constructor( val, propName = '', errors = '') {
        this.errorSwitch = false;
        this.val = val;
        this.errors = errors;
        this.propName = propName;
        this.status = true;
        this.verifyDefined();
        this.verifyLength();
    }

    getErrorStatus() {
        return this.status;
    }

    /**
     * Verify prop is defined
     * @returns void
     */
    verifyDefined() {
        if (typeof this.val === "undefined") {
            this.errors += `${this.propName} is undefined and is required. `;
            this.errorSwitch = true;
            this.status =  false
            return;
        }
        this.status = true;
    }

    /**
     * Verify length of prop value is not zerro
     */
    verifyLength() {
        if (typeof this.val !== "undefined"){
            if (this.val.length === 0) {
                this.wrongValue();
                this.errorSwitch = true;
                this.status = false;
                return;
            }
        }
        this.status = true;
    }
    /**
     * Get the Prop's value
     * @returns mixed 
     */
    getVal() {
        return this.val;
    }

    /**
     * Get Errors
     * @returns string - a concatenated string of all errors collected
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Get Errors Switch - a switch that if false means no errors thrown 
     * otherwise they have been thrown
     * @returns bool
     */
    getErrorSwitch() {
        return this.errorSwitch;
    }

    /**
     * Wrong Value - creates and error message for wrong values
     * @returns string - the error
     */
    wrongValue(errorExtention='') {
        this.errors += `${this.propName} is wrong, it has zero length. ${errorExtention}`
    }
}