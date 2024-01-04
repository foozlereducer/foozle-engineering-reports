import test from 'ava';
import { iApiAdapter } from '../../../services/adapters/iApiAdapter.js';


test('iApiAdapter should error if authenticate method is not implemented', async t=>{
    try {
         class a extends iApiAdapter {}
         const iA = new a()
    } catch(e) {
         t.is('Implement a authenticate method to use iApiAdapter', e)
    }
    
     t.true(true)
 })

 test('iApiAdapter should error if setRout method is not implemented', async t=>{
    try {
         class a extends iApiAdapter {
            authenticate(){}
         }
         const iA = new a()
    } catch(e) {
         t.is('Implement a setRoute method to use iApiAdapter', e)
    }
    
     t.true(true)
 })

 test('iApiAdapter should error if runRout method is not implemented', async t=>{
    try {
         class a extends iApiAdapter {
            authenticate(){}
            setRoute(route){}
         }
         const iA = new a()
    } catch(e) {
         t.is('Implement a runRoute method to use iApiAdapter', e)
    }
    
     t.true(true)
 })

 test('iApiAdapter should not error if all the required methods authenticate(), setRoute() method exists', async t=>{
        class a extends iApiAdapter {
            authenticate() {
                return true
            }
            setRoute(route){}
            async runRoute(){}
        }
        const iA = new a()
        t.true(iA instanceof iApiAdapter)
        t.true(iA instanceof a)
        t.is(typeof iA.authenticate, "function")
        t.is(typeof iA.setRoute, 'function')
        t.is(typeof iA.runRoute, 'function')
 })