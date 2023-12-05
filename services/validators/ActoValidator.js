/**
 * Acto Validator 
 */
export class ActoValidator {
    /**
     * Constuctor - sets up the validation class's properties
     * @returns self
     */
    constructor() {
        
        // @prop {number} value - is the value being validated
        // it is initialized as a null  so it must be mutated to 
        // a positive number
        this.value = null;

        // @prop {boolean} chainable - defines if or if not a method is chaninable
        this.chainable = true;

        this.field = '';

        // @prop {boolean} pass - is the flag used for pass or fail
        this.pass = false;

        // The return of this is reqired to create chained methods
        return this;
    }
  
    getChainable() {
        return this._chainable;
    }

    setChainable(mode = true) {
        if(typeof mode !== 'boolean') {
            throw {statusCode: 204, message:`requires setChainable(boolean), ${typeof mode} given`};
        }
        this.chainable = mode;
    }

    
    /**
     * Validate is the method to use to set the value being validated
     * It is setup as a chained method which is why it returns this
     * @param {number} value 
     * @returns this - instance of this object for the ability to chain 
     */
    validate(value) {
        this.value = value;
        return this;
    }
    #validateNumber() {
        if('undefined' === typeof this.value) {
            this.notEmpty(this.value)
        }
        if(typeof this.value !== "number" ) {
            this.pass = false;
            throw {statusCode: 406, message:`Expect checked value to be number, ${typeof this.value} given`}
        }
    }
    /**
     * Number check - validates the value is a number.
     * @returns this - instance of this object for the ability to chain
     */
    num() {
        this.#validateNumber();
        this.pass = true;
        return this;
    };
    min(minValue) {
        this.#validateNumber();
        this.pass = false;
        if(this.value <= minValue) {
            throw new Error( `Number expected to be a least ${minValue}`);
        }
        this.pass = true;
        return this;
    }
   
    notEmpty(val = null) {
        if( null !== val && null == this.value) {
            this.value = val;
        }
        let error = {statusCode: 204, message:`notEmpty(val): val is empty, it needs a value to test`};
        if (typeof this.value === 'string') {
            this.value.trim()
        }
        // verify val is not either null or empty. Trim in-case of leading whitespace
        if(typeof this.value === undefined || this.value === null || this.value.length === 0) {
            throw error;
        }
        
        if (this.chainable === true) {
            console.log(`inside chainable`)
            return this
        } else {
            this.field = this.value;
            return this.field.length !== 0
        }
    }
    // actions.max = function(value) {
        //    console.log(value)
        // }
}

