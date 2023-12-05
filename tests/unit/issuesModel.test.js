import test from 'ava';
import { Issues } from '../../models/issues.js';

test("Validate should throw all validation errors with none of the required issue fields set", async t => {
    const iS = new Issues();
    const except = async () => {
       throw new Error(await iS.save());
    }
    try {
        await except();
    } catch(e) {
        const errors = JSON.stringify(e);
        console.log(errors)
        /**
         * {"errors":{"description":{"name":"ValidatorError",
         * "message":"Path `description` is required.",
         * "properties":
         * {"message":"Path `description` is required.",
         * "type":"required","path":"description"},
         * "kind":"required",
         * "path":"description"
         * },"issueName":{
         * "name":"ValidatorError",
         * "message":"Path `issueName` is required.",
         * "properties":{
         *  "message":"Path `issueName` is required.",
         *  "type":"required",
         *  "path":"issueName"
         * },
         * "kind":"required","path":"issueName"},
         * "ticketId":{
         *  "name":"ValidatorError",
         *  "message":"Path `ticketId` is required.",
         *  "properties":{"message":"Path `ticketId` is required.",
         *  "type":"required",
         *  "path":"ticketId"},
         *  "kind":"required",
         *  "path":"ticketId"},
         *  "team":{
         *  "name":"ValidatorError","message":"Path `team` is required.",
         *  "properties":{
         *  "message":"Path `team` is required.",
         *  "type":"required","path":"team"},
         *  "kind":"required","path":"team"}},
         *  "_message":"Issues validation failed","name":"ValidationError",
         *  "message":"Issues validation failed: description: Path `description`
         *  is required., issueName: Path `issueName` is required., 
         *  ticketId: Path `ticketId` is required., team: Path `team` 
         *  is required."
         * }
         */
        t.true(errors.includes('`description` is required.'));
        t.true(errors.includes('`issueName` is required.'));
        t.true(errors.includes('`ticketId` is required.'));
        t.true(errors.includes('`team` is required.'));
        t.true(errors.includes("`issueRole` is required. There must be at least one role added to each issue"));
        t.true(errors.includes("`the estimated story point field` is required, either 0, 1, 2, 3, 5, 8, or 13"));
    }
});