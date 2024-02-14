import test from 'ava'
import { Dates } from '../../../services/utilities/Dates.js'

test('a string should validate as a UTC date', async t=>{
    const d = new Dates();
    const date = '2023-05-15T12:34:56.789Z';
    t.true(d.isValidUTCDate(date));
})

test('getNow should return a valid utc date of now', async t=> {
    const d = new Dates();
    t.true(d.isValidUTCDate(d.getNow()))
})
