import test from 'ava';
import { HttpStatusCode } from '../../errorHandlers/httpStatusCodes.js';

test("OK status returns 200", async t=> {
    t.is(200, HttpStatusCode.OK)
})

test("BAD_REQUEST status returns 400", async t=> {
    t.is(400, HttpStatusCode.BAD_REQUEST)
})

test("NOT_FOUND status returns 404", async t=> {
    t.is(404, HttpStatusCode.NOT_FOUND)
})

test("NOT_ACCEPTED status returns 406", async t=> {
    t.is(406, HttpStatusCode.NOT_ACCEPTABLE)
})

test("INTERNAL_SERVER status returns 500", async t=> {
    t.is(500, HttpStatusCode.INTERNAL_SERVER)
})