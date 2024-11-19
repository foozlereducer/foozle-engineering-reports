import test from 'ava';
import { PropsValidationAggregator } from '../../../services/validators/PropsValidationAggregator.js';
import { PropValidator } from '../../../services/validators/PropValidator.js';


test("PropsValidationAggregator should generate PostValidators", t=> {
    const PVA = new PropsValidationAggregator();
    const aPV = PVA.generatePropValidator("Joe's first big story", "issueName");
    t.is(typeof aPV,'object')
    t.true(aPV instanceof PropValidator)
})

test("PropsValidationAggregator should return a list of prop validators", async t=> {
    const PVA = new PropsValidationAggregator();
    const aPV = PVA.generatePropValidator("Joe's first big story", "issueName");
    const aPV2 = PVA.generatePropValidator(
        "Steve's 100th story about null", 
        "issueName"
    )

    const props = [aPV, aPV2]

    t.deepEqual(props, PVA.getProps())
})

test("PropsValidationAggregator should throw error when no PropValidator(s) are added", async t=> {
    try {
        const PVA = new PropsValidationAggregator();
        PVA.processValidators()
    } catch(e) {
        t.is(e, 'You must generate at least one PropValidator using generatePropValidator(val,propName) ')
    } 
})

test("PropsValidationAggregator should throw empty error if getProps() has no validators", t=> {
    try {
        const PVA = new PropsValidationAggregator();
        PVA.getProps()
    } catch(e) {
        t.is(e, 'You must generate at least one PropValidator using generatePropValidator(val,propName) ')
    } 
})

test("PropsValidationAggregator's issueName in multiple props pass validation", t=> {
    const PVA = new PropsValidationAggregator();
    const aPV = PVA.generatePropValidator("Joe's first big story", "issueName");
    const aPV2 = PVA.generatePropValidator(
        "Steve's 100th story about null", 
        "issueName"
    )
    const validatorResult = PVA.processValidators();

    t.true(validatorResult.status);
    t.is(validatorResult.errors, '');
})

test("PropsValidationAggregator's issueName in multiple props fail validation with missing data", t=> {
    const PVA = new PropsValidationAggregator();
    PVA.generatePropValidator("", "issueName");
    
    PVA.generatePropValidator('', "team")
    const validatorResult = PVA.processValidators();

    t.true(true)
    t.false(validatorResult.status);
    t.is(validatorResult.errors, 'issueName is wrong, it has zero length. team is wrong, it has zero length. ');
})