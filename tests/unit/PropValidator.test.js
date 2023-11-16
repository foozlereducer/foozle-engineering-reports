import test from 'ava';
import { PropsValidator } from '../../validators/PropsValidator.js';

test("getVal should return the constructor given value", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
    t.is(undefined, PV.getVal());
    const PV2 = new PropsValidator(4, 'StoryPoints');
    t.is(4, PV2.getVal());
})

test("getErrors should return concatenated errors", async t=> {
    var undefinedVal;
    const PV = new PropsValidator(undefinedVal, 'StoryPoints');
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

// test("The props validator should create an error a zero length v")