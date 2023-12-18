import test from 'ava';
import { PropValidator } from '../../../services/validators/PropValidator.js';

test("getVal should return the constructor given parameter value", async t=> {
    var undefinedVal;
    const PV = new PropValidator(undefinedVal, 'StoryPoints');
    t.is(undefined, PV.getVal());
    const PV2 = new PropValidator(4, 'StoryPoints');
    t.is(4, PV2.getVal());
})

test("Errors can be concatenate between multiple propsValidators", async t=> {
    var undefinedVal;
    const PV = new PropValidator(undefinedVal, 'StoryPoints');
    // Notice passing on the errors to the next PropValidator
    const PV2 = new PropValidator('', 'StoryPoints', PV.getErrors());
    t.deepEqual('StoryPoints is undefined and is required. StoryPoints is wrong, it has zero length. ', PV2.getErrors());
})

test("Errors should show that a wrong zero length value was set for the prop val", async t=> {
    const PV = new PropValidator('', 'StoryPoints');
    const errors =  PV.getErrors();
    t.deepEqual('StoryPoints is wrong, it has zero length. ', errors);
})

test("The props validator shouldn't crash and verify undefined val ", async t=> {
    var undefinedVal;
    const PV = new PropValidator(undefinedVal, 'StoryPoints');
    t.is(undefined, PV.getVal());
    const errors = PV.getErrors();
    t.is('StoryPoints is undefined and is required. ', errors)
})

test("The props validator errorSwitch() when an error is added this reads true", async t=> {
    var undefinedVal;
    const PV = new PropValidator(undefinedVal, 'StoryPoints');
    t.true(PV.getErrorSwitch())
})

test("The WrongValue method can append additional error messaging", async t=> {
    var undefinedVal;
    const PV = new PropValidator(undefinedVal, 'StoryPoints');
    PV.wrongValue()
    const error =  PV.getErrors()
    t.is(error, 'StoryPoints is undefined and is required. StoryPoints is wrong, it has zero length. ')
    PV.wrongValue('The value should be 0,1,2,3,5,8 or 13');
    const error2 = PV.getErrors()
    t.is (
        'StoryPoints is undefined and is required. StoryPoints is wrong, it has zero length. StoryPoints is wrong, it has zero length. The value should be 0,1,2,3,5,8 or 13',
        error2
    )
})