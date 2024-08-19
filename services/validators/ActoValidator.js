export class ActoValidator {
    constructor() {
        this.value = null;
        this.chainable = true;
        this.field = '';
        this.pass = false;
        return this;
    }
  
    getChainable() {
        return this.chainable;
    }

    setChainable(mode = true) {
        if (typeof mode !== 'boolean') {
            throw { statusCode: 204, message: `requires setChainable(boolean), ${typeof mode} given` };
        }
        this.chainable = mode;
    }

    validate(value) {
        this.value = value;
        return this;
    }

    #typeCheck(type = 'number') {
        if ('undefined' === typeof this.value) {
            this.notEmpty(this.value);
        }
        if (typeof this.value !== type) {
            this.pass = false;
            throw { statusCode: 406, message: `Expect checked value to be a ${type}, ${typeof this.value} given` };
        }
    }

    num() {
        this.#typeCheck();
        this.pass = true;
        return this;
    }

    array() {
        if (Array.isArray(this.value)) {
            this.pass = true;
        } else {
            throw new Error(`Array expected ${typeof this.value} given.`);
        }
        return this;
    }

    String() {
        this.#typeCheck('string');
        this.pass = true;
        return this;
    }

    min(minValue) {
        this.#typeCheck();
        this.pass = false;
        if (this.value <= minValue) {
            throw new Error(`Number expected to be at least ${minValue}`);
        }
        this.pass = true;
        return this;
    }

    notEmpty(val = null) {
        if (null !== val && null == this.value) {
            this.value = val;
        }
        if (typeof this.value === 'string') {
            this.value = this.value.trim();
        }
        if (typeof this.value === 'undefined' || this.value === null || this.value.length === 0) {
            throw { statusCode: 204, message: `The value passed into validate is empty, it needs a value to test` };
        }
        if (this.chainable === true) {
            return this;
        } else {
            this.field = this.value;
            return this.field.length !== 0;
        }
    }

    // Middleware function to use in Express with chaining support
    
    static validateMiddleware(...validators) {
        return (req, res, next) => {
            try {
                for (const validator of validators) {
                    validator(req);
                }
                next(); // If all validations pass, call next() to continue
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
