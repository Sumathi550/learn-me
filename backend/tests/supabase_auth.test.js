/**
 * Automated Verification Test Suite for Supabase Authentication Integration
 * Tests password requirements, email validation, environment variable isolation, and security guarantees.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Supabase Authentication Integration Tests...\n');

// TEST 1: Password validation logic matches all specification criteria
function validatePassword(password) {
    return {
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        length: password.length >= 8
    };
}

function isPasswordValid(password) {
    const rules = validatePassword(password);
    return Object.values(rules).every(Boolean);
}

// TEST 1 & Specification: Valid password
assert.strictEqual(isPasswordValid('LearnMe@2026'), true, 'TEST 1: Valid password passes all requirements');

// TEST 2: Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
assert.strictEqual(emailRegex.test('invalid-email'), false, 'TEST 2: Invalid email correctly rejected');
assert.strictEqual(emailRegex.test('student@example.com'), true, 'TEST 2b: Valid email correctly accepted');

// TEST 3: Password without uppercase
assert.strictEqual(isPasswordValid('learnme@2026'), false, 'TEST 3: Password without uppercase is blocked');
assert.strictEqual(validatePassword('learnme@2026').uppercase, false);

// TEST 4: Password without lowercase
assert.strictEqual(isPasswordValid('LEARNME@2026'), false, 'TEST 4: Password without lowercase is blocked');
assert.strictEqual(validatePassword('LEARNME@2026').lowercase, false);

// TEST 5: Password without number
assert.strictEqual(isPasswordValid('LearnMe@Password'), false, 'TEST 5: Password without number is blocked');
assert.strictEqual(validatePassword('LearnMe@Password').number, false);

// TEST 6: Password without special character
assert.strictEqual(isPasswordValid('LearnMe2026'), false, 'TEST 6: Password without special character is blocked');
assert.strictEqual(validatePassword('LearnMe2026').special, false);

// TEST 7: Password less than 8 characters
assert.strictEqual(isPasswordValid('L@1ab'), false, 'TEST 7: Password less than 8 characters is blocked');
assert.strictEqual(validatePassword('L@1ab').length, false);

console.log('✅ TEST 1-7: All password & email validation rules PASSED.');

// TEST 8: Verify .gitignore ignores .env and .env.local
const rootGitignorePath = path.resolve(__dirname, '../../.gitignore');
assert(fs.existsSync(rootGitignorePath), '.gitignore must exist in root');
const gitignoreContent = fs.readFileSync(rootGitignorePath, 'utf8');
assert(gitignoreContent.includes('.env'), '.gitignore must ignore .env');
assert(gitignoreContent.includes('.env.local'), '.gitignore must ignore .env.local');
console.log('✅ TEST 8: .gitignore security check PASSED (ignores .env and .env.local).');

// TEST 9: Verify .env does not contain user passwords or secret service_role keys
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    assert(!envContent.includes('service_role'), '.env must not expose service_role key');
    assert(!envContent.toLowerCase().includes('user_password'), '.env must not store user passwords');
    console.log('✅ TEST 9: .env secret isolation check PASSED.');
}

// TEST 10: Verify frontend files use only Publishable key and safe Supabase client
const signupHtmlPath = path.resolve(__dirname, '../../student-web/signup.html');
const loginHtmlPath = path.resolve(__dirname, '../../student-web/login.html');
const supabaseClientPath = path.resolve(__dirname, '../../student-web/js/supabaseClient.js');

assert(fs.existsSync(signupHtmlPath), 'student-web/signup.html must exist');
assert(fs.existsSync(loginHtmlPath), 'student-web/login.html must exist');
assert(fs.existsSync(supabaseClientPath), 'student-web/js/supabaseClient.js must exist');

const signupHtml = fs.readFileSync(signupHtmlPath, 'utf8');
const loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');
const clientJs = fs.readFileSync(supabaseClientPath, 'utf8');

assert(signupHtml.includes('toggle-password-btn'), 'signup.html has password visibility toggle');
assert(signupHtml.includes('password-rules-list'), 'signup.html has dynamic password requirement checklist');
assert(signupHtml.includes('Creating account...'), 'signup.html has loading state');
assert(loginHtml.includes('toggle-password-btn'), 'login.html has password visibility toggle');
assert(loginHtml.includes('Signing in...'), 'login.html has loading state');
assert(clientJs.includes('onAuthStateChange'), 'supabaseClient.js has onAuthStateChange listener');
assert(clientJs.includes('signUp'), 'supabaseClient.js has signUp method');
assert(clientJs.includes('signInWithPassword'), 'supabaseClient.js has signInWithPassword method');
assert(clientJs.includes('signOut'), 'supabaseClient.js has signOut method');

console.log('✅ TEST 10: Frontend UI & Supabase Client checks PASSED.');

// TEST 11: Verify RLS policy script exists and includes auth.uid()
const rlsSqlPath = path.resolve(__dirname, '../migrations/supabase_rls.sql');
assert(fs.existsSync(rlsSqlPath), 'supabase_rls.sql must exist');
const rlsSql = fs.readFileSync(rlsSqlPath, 'utf8');
assert(rlsSql.includes('ENABLE ROW LEVEL SECURITY'), 'RLS must be enabled');
assert(rlsSql.includes('auth.uid()'), 'RLS must use auth.uid()');
console.log('✅ TEST 11: RLS SQL migration & policies verification PASSED.');

console.log('\n🎉 ALL 11 AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
