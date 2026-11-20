import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

test('Navbar has transparent classes and scroll handling for overlay', () => {
  const navbarPath = path.resolve('src/components/Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf8');

  // Should have transparency class or dynamic transparency state
  assert.match(
    content,
    /bg-transparent/,
    'Navbar should include bg-transparent styling'
  );

  // Should handle scroll or transparency state
  assert.match(
    content,
    /isScrolled|scrollY/,
    'Navbar should support transparent state when at the top'
  );
});

test('Navbar transparency is active across all pages (not restricted only to home)', () => {
  const navbarPath = path.resolve('src/components/Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf8');

  // Should NOT restrict transparency exclusively with isHome check on nav background
  assert.doesNotMatch(
    content,
    /isHome\s*\?\s*isScrolled/,
    'Navbar transparency should apply across all pages, not just home'
  );
});

test('HeroSection or Landing accommodates transparent navbar with offset', () => {
  const landingPath = path.resolve('src/components/RishtaMatrimonyLanding.tsx');
  const heroPath = path.resolve('src/components/HeroSection.tsx');
  const landingContent = fs.readFileSync(landingPath, 'utf8');
  const heroContent = fs.readFileSync(heroPath, 'utf8');

  const hasOverlayLayout =
    heroContent.includes('-mt-16') ||
    heroContent.includes('pt-16') ||
    landingContent.includes('-mt-16') ||
    landingContent.includes('relative');

  assert.ok(
    hasOverlayLayout,
    'Hero section or landing page should support transparent navbar overlay'
  );
});

test('Profiles page header has adequate top padding to clear transparent navbar', () => {
  const profilesPath = path.resolve('src/pages/Profiles.tsx');
  const content = fs.readFileSync(profilesPath, 'utf8');

  // Should NOT use invalid pt-22 class
  assert.doesNotMatch(
    content,
    /pt-22/,
    'Profiles header must not use invalid pt-22 class'
  );
  assert.match(
    content,
    /pt-24|pt-28/,
    'Profiles header should have valid top padding (pt-24 or pt-28) to clear navbar'
  );
});

test('Logo image has transparent alpha background around emblem', () => {
  const cmd = `python -c "from PIL import Image; im = Image.open('src/assets/logo.png'); assert im.mode == 'RGBA'; assert im.getpixel((0, 0))[3] == 0; print('OK')"`;
  const result = execSync(cmd, { encoding: 'utf8' }).trim();
  assert.equal(result, 'OK', 'logo.png should have RGBA mode with transparent corners');
});

test('Navbar maintains balanced logo size fitting neatly within standard h-16 container', () => {
  const navbarPath = path.resolve('src/components/Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf8');

  // Navbar inner container must be h-16 to match -mt-16 page offsets with 0px gap
  assert.match(
    content,
    /justify-between h-16/,
    'Navbar inner height should be h-16 to match -mt-16 offset without top line'
  );

  // Logo should be balanced (around 48px - 52px)
  assert.match(
    content,
    /h-12|h-\[50px\]|sm:h-\[50px\]|h-\[52px\]/,
    'Logo should be balanced to stay cleanly inside navbar'
  );
});

test('Logo asset is cropped to emblem content without large whitespace', () => {
  const cmd = `python -c "from PIL import Image; im = Image.open('src/assets/logo.png'); w, h = im.size; assert w < 900 and h < 900, f'Expected trimmed image, got {w}x{h}'; print('OK')"`;
  const result = execSync(cmd, { encoding: 'utf8' }).trim();
  assert.equal(result, 'OK', 'logo.png should be cropped without 130px transparent padding');
});

test('Mobile and tablet menu dropdown uses hero cream color instead of white card background', () => {
  const navbarPath = path.resolve('src/components/Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf8');

  // Should use bg-cream on mobile menu container
  assert.match(
    content,
    /bg-cream/,
    'Mobile menu dropdown should use hero cream background'
  );

  // Should not use pure white bg-card on mobile menu container
  assert.doesNotMatch(
    content,
    /className="[^"]*md:hidden[^"]*bg-card/,
    'Mobile menu dropdown should not use white bg-card'
  );
});
