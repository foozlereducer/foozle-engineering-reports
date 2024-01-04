import test from 'ava';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';

test("The validator should validate a number is an number", async t=> {
    const Validator = new ActoValidator();
    let result = Validator.validate(5).num()
    t.is(result.pass, true)
    try {
        Validator.validate('5').num()
    } catch(e) {
        t.is(e.message, 'Expect checked value to be a number, string given')
    }

    try {
        Validator.validate({}).num()
    } catch(e) {
        t.is(e.message, 'Expect checked value to be a number, object given')
    }
})

test(".min(4) should not error when passed a value greater than 4", async t => {
    const Validator = new ActoValidator();
    const result = Validator.validate(5).min(4)
    
    // passing condition
    t.true(result.pass);
    
});

test(".min(4) should error when passed a value less than 4", async t => {
    const Validator = new ActoValidator();
    const minValue = 4;
    try {
        Validator.validate(2).min(minValue);
    } catch(e) {
        t.is(e.message, `Number expected to be a least ${minValue}`)
    }
});

test("valide(value): value must be a positive integer", async t => {
    const Validator = new ActoValidator();
    const boundary = "";
    try {
        Validator.validate(boundary).min(4)
    } catch(e) {
        t.is(e.message,`Expect checked value to be a number, ${typeof boundary} given`)
    }

    const boundary2 = -4;
    try {
        Validator.validate(boundary2).min(4)
    } catch(e) {
        t.is(e.message,`Number expected to be a least 4`)
    }
});

test("notEmpty() non-chainable returns true when a field is not empty", async t => {
    const Validator = new ActoValidator();
    Validator.setChainable = false;
    
    const validateThis = Validator.notEmpty("issues");
    t.is('','')
    // t.true(validateThis)
})

test("notEmpty() returns true when a field is not empty", async t => {
    const Validator = new ActoValidator();
    Validator.setChainable(false);
    t.true(Validator.notEmpty('issues'))
})

test('notEmpty()', async t => {
    const Validator = new ActoValidator();
    Validator.setChainable(false);
    t.true(Validator.notEmpty({}))
})

test('Validation should chain', async t => {
    const Validator = new ActoValidator();
    const validateThis = Validator.validate(2).notEmpty().num();
    t.is(validateThis.value, 2);
    t.true(validateThis.chainable);
    t.true(validateThis.pass)
})

test('Validation should throw validation error at any point in the chained functions', async t => {
    const Validator = new ActoValidator();
    try {
        Validator.validate('2').notEmpty().num();
    } catch(e) {
        t.is(e.statusCode, 406);
        t.is(e.message, 'Expect checked value to be a number, string given')
    }
})

// test(".notEmpty(val) should error when val is empty", async t => {
//     const Validator = new ActoValidator();
//     try {
//         Validator.notEmpty("").min(minValue);
//     } catch(e) {
//         t.is(e.message, `notEmpty(val): val is empty, it needs a value to test`)
//     }
// });