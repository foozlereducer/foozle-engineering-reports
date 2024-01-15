import test from 'ava'
import { sum } from '../../../services/utilities/Sum.js'

test("sum() should sum the numbers in an array", t=>{
    const a = [0,1,2,3];
    t.is(sum(a), 6) 
})

test(`sum() be 0 if an array data contains a mixture of 
        numbers, nulls and or undefined values`, t=>{
    const a = '0,1,2,3';
    t.is(sum(a), 0)
    const b = [0,null,1];
    t.is(sum(b), 1);
    // c is undefined
    var c;
    const d = [1,c,7]
    t.is(sum(d), 8);
})