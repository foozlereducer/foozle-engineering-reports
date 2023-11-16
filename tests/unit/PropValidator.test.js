import test from 'ava';
import { PropsValidator } from '../../validators/PropsValidator.js';

test("getVal should return the constructor given parameter value", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
    t.is(undefined, PV.getVal());
    const PV2 = new PropsValidator(4, 'StoryPoints');
    t.is(4, PV2.getVal());
})

test("Errors can be concatenate between multiple propsValidators", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
    // Notice passing on the errors to the next PropsValidator
    const PV2 = new PropsValidator('', 'StoryPoints', PV.getErrors());
    t.is('StoryPoints is undefined and is required. StoryPoints is wrong, it has zero length. ', PV2.getErrors());
})

test("Errors should show that a wrong zero length value was set for the prop val", async t=> {
    const PV = new PropsValidator('', 'StoryPoints');
    t.is('StoryPoints is wrong, it has zero length. ', PV.getErrors());
})

test("The props validator shouldn't crash and verify undefined val ", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
    t.is(undefined, PV.getVal());
    const errors = PV.getErrors();
    t.is('StoryPoints is undefined and is required. ', errors)
})

test("The props validator errorSwitch() when an error is added this reads true", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
    t.true(PV.getErrorSwitch())
})

test("The WrongValue method can append additional error messaging", async t=> {
    var undefinedVal;
    const PV = new PropsValidator('', 'StoryPoints');
    const error =  PV.wrongValue()
    t.is(error, 'StoryPoints is wrong, it has zero length. ')
    const error2 = PV.wrongValue('The value should be 0,1,2,3,5,8 or 13');
    t.is (
        'StoryPoints is wrong, it has zero length. The value should be 0,1,2,3,5,8 or 13',
        error2
    )
})