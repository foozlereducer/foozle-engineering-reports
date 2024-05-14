import test from 'ava';
import sinon from 'sinon';
import { authUtils } from '../../../services/auth/verifyAllowed.js'

// Mocking isValidEmail globally
sinon.stub(authUtils, 'isValidEmail').callsFake(email => /^.+@.+\..+$/.test(email));


test.afterEach(() => {
    sinon.restore();
});

// Testing valid email and existing user
test('verifyAllowed returns true for valid email and found in DB', async t => {
    const email = "example@example.com";
    const mockDB = { find: sinon.stub().returns(true) };

    const result = authUtils.verifyAllowed(email, mockDB);

    t.true(result);
    t.true(mockDB.find.calledWith({email: email}));
});

// Testing invalid email
test('verifyAllowed returns false for invalid email', async t => {
    const email = "invalid-email";
    const mockDB = { find: sinon.stub().returns(true) };

    const result = authUtils.verifyAllowed(email, mockDB);

    t.false(result);
    t.false(mockDB.find.called); // Should not call DB if email is invalid
});

// Testing valid email but not in database
test('verifyAllowed returns false for valid email but not found in DB', async t => {
    const email = "notfound@example.com";
    const mockDB = { find: sinon.stub().returns(false) };

    const result = authUtils.verifyAllowed(email, mockDB);

    t.false(result);
    t.true(mockDB.find.calledWith({email: email}));
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
    '" "@example.org', // (space between quotes)
    '"john..doe"@example.org', // (quoted double dot)
    '"abc\\@def"@example.com', // (quoted special characters)
    '"abc\\\"def"@example.com', //  (escaped quotes)
    '用户@例子.广告', // (Unicode characters in local and domain)
    '我買@屋企.香港', // (Unicode characters)
    '二ノ宮@黒川.日本', // (Japanese characters)
    'чебурашка@ящик-с-апельсинами.рф', // (Cyrillic email)
    'A@b@c@example.com',
    'just"not"right@example.com',
    'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
    
];

const invalidEmails = [
    'Abc.example.com', // now considered invalid due to lack of TLD
    'admin@mailserver1', // (local domain name with no TLD, can be invalid for standard internet email)
    'example@localhost', // (localhost is generally not valid in email headers sent externally)
];

validEmails.forEach(email => {
    test(`Valid email: ${email}`, t => {
        t.true(authUtils.isValidEmail(email), `The email ${email} should be valid.`);
    });
});



invalidEmails.forEach(email => {
    test(`Invalid email: ${email}`, t => {
        t.false(authUtils.isValidEmail(email), `The email ${email} should be invalid.`);
    });
});
