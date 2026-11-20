import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MemberLogin page implements Concept 2 Integrated Page-Flow layout', () => {
  const loginPath = path.resolve('src/pages/MemberLogin.tsx');
  const content = fs.readFileSync(loginPath, 'utf8');

  // Must have the Islamic page header section (consistent with Register/Profiles)
  assert.match(
    content,
    /Member Portal & Profile Access|Member Portal/,
    'MemberLogin must have the dedicated page header title'
  );
  assert.match(
    content,
    /﷽/,
    'MemberLogin header must include Bismillah calligraphy'
  );

  // Must accommodate transparent navbar with offset
  assert.match(
    content,
    /-mt-16\s+pt-(24|28)/,
    'MemberLogin header must have proper -mt-16 pt-24/pt-28 offset for transparent navbar'
  );

  // Must feature the Member Dashboard Features section (Concept 2 requirement)
  assert.match(
    content,
    /Member Dashboard Features/,
    'MemberLogin must include the Member Dashboard Features section'
  );
  assert.match(
    content,
    /Update (Your|your) Biodata & Photos/,
    'MemberLogin must highlight biodata editing capability'
  );
  assert.match(
    content,
    /Control Profile Privacy|Privacy/,
    'MemberLogin must highlight privacy control'
  );

  // Must include the 3-step "How Member Access Works" walkthrough section
  assert.match(
    content,
    /How Member Access Works/,
    'MemberLogin must include the 3-step walkthrough section'
  );

  // Must preserve all essential OTP login logic
  assert.match(
    content,
    /requestOtp/,
    'MemberLogin must retain requestOtp handler'
  );
  assert.match(
    content,
    /verifyOtp/,
    'MemberLogin must retain verifyOtp handler'
  );
  assert.match(
    content,
    /member-login-request/,
    'MemberLogin must call member-login-request supabase function'
  );
  assert.match(
    content,
    /member-login-verify/,
    'MemberLogin must call member-login-verify supabase function'
  );
});
