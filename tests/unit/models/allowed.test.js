import test from 'ava';
import { verifyAllowed, isValidEmail } from '../../../services/auth/verifyAllowed.js'; // Adjust the path as necessary
import { Allowed } from '../../../models/allowed.js'; // Adjust the path as necessary

let originalFind; // For manual mocking the find method

test.beforeEach(t => {
    // Save the original method so we can restore it later
    originalFind = Allowed.find;
});

test.afterEach(() => {
    // Restore the original method
    Allowed.find = originalFind;
});

// Testing valid email and existing user
test('verifyAllowed returns true for valid email and found in DB', async t => {
    const email = "example@example.com";

    // Mock connectDB as a resolved promise function
    const mockConnectDB = async () => {};

    // Manually mock Allowed to return a matching document
    Allowed.find = async () => [{ email }];

    const result = await verifyAllowed(email, mockConnectDB, Allowed);

    t.true(result);
});

// Testing invalid email
test('verifyAllowed returns false for invalid email', async t => {
    const email = "invalid-email";

    // Manually mock connectDB as a resolved promise function
    const mockConnectDB = async () => {};

    const result = await verifyAllowed(email, mockConnectDB);

    t.false(result);
});

// Testing valid email but not in database
test('verifyAllowed returns false for valid email but not found in DB', async t => {
    const email = 'notfound@example.com';

    // Manually mock connectDB as a resolved promise function
    const mockConnectDB = async () => {};

    // Manually mock Allowed.find to return no documents (empty array)
    Allowed.find = async () => [];

    const result = await verifyAllowed(email, mockConnectDB, Allowed);

    t.false(result); // Expect the result to be false since email is not found
});

// Testing valid email but database throws an error
test('verifyAllowed handles database error gracefully', async t => {
    const email = "example@example.com";

    // Manually mock connectDB as a resolved promise function
    const mockConnectDB = async () => {};

    // Manually mock Allowed.find to throw an error
    Allowed.find = async () => { throw new Error('Database error'); };

    const error = await t.throwsAsync(async () => {
        await verifyAllowed(email, mockConnectDB, Allowed);
    });

    t.is(error.message, 'Database error');
});

const validEmails = [
    'simple@example.com',
    'very.common@example.com',
    'disposable.style.email.with+symbol@example.com',
    'other.email-with-hyphen@example.com',
    'fully-qualified-domain@example.com',
    'user.name+tag+sorting@example.com',
    'x@example.com', // (one-letter local-part)
    'john.doe@example.com',
    'a.little.lengthy.but.fine@dept.example.com',
    'example@s.solutions', // (single character TLD) 
];

const invalidEmails = [
    'Abc.example.com', // now considered invalid due to lack of TLD
    'admin@mailserver1', // (local domain name with no TLD, can be invalid for standard internet email)
    'example@localhost', // (localhost is generally not valid in email headers sent externally)
    '" "@example.org', // (space between quotes)
    '"john..doe"@example.org', // (quoted double dot)
    '用户@例子.广告', // (Unicode characters in local and domain)
    '我買@屋企.香港', // (Unicode characters)
    '二ノ宮@黒川.日本', // (Japanese characters)
    'чебурашка@ящик-с-апельсинами.рф', // (Cyrillic email)
    'A@b@c@example.com',
    'just"not"right@example.com',
    'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
    '"abc\\@def"@example.com', // (quoted special characters)  
    '"abc\\\"def"@example.com', //  (escaped quotes)
];

validEmails.forEach(email => {
    test(`Valid email: ${email}`, t => {
        t.true(isValidEmail(email), `The email ${email} should be valid.`);
    });
});

invalidEmails.forEach(email => {
    test(`Invalid email: ${email}`, t => {
        t.false(isValidEmail(email), `The email ${email} should be invalid.`);
    });
});
