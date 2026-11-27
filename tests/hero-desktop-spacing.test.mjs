import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const HERO_PATH = path.resolve("src/components/HeroSection.tsx");

function readHeroContent() {
  return fs.readFileSync(HERO_PATH, "utf-8");
}

test("1. HeroSection copy container wraps content from Assalamualaikum down to How to Join", () => {
  const content = readHeroContent();

  const copyIndex = content.indexOf("{/* Copy */}");
  assert.ok(copyIndex !== -1, "HeroSection must have a {/* Copy */} section");

  const assalamuIndex = content.indexOf("Assalamualaikum! 🌸", copyIndex);
  assert.ok(assalamuIndex !== -1, "Copy container must contain Assalamualaikum! greeting");

  const howToJoinIndex = content.indexOf("How to Join / Verify", assalamuIndex);
  assert.ok(howToJoinIndex !== -1, "Copy container must contain How to Join / Verify at the bottom");
});

test("2. HeroSection copy container applies a gentle upward shift exclusively on desktop (lg:)", () => {
  const content = readHeroContent();
  const copyBlockMatch = content.match(/{\/\*\s*Copy\s*\*\/}\s*<motion\.div([^>]+)>/s);
  assert.ok(copyBlockMatch, "HeroSection must have motion.div opening tag for Copy");

  const attributes = copyBlockMatch[1];
  const classMatch = attributes.match(/className=["']([^"']+)["']/);
  assert.ok(classMatch, "Copy motion.div must have a className attribute");

  const classNames = classMatch[1];

  // Must have a gentle desktop-only negative top margin or upward translation (e.g. lg:-mt-6, lg:-mt-7, lg:-mt-8)
  const hasDesktopShift = /lg:-mt-(?:6|7|8|\[\d+px\])/.test(classNames);
  assert.ok(
    hasDesktopShift,
    `Copy container must have desktop-only upward shift (e.g. lg:-mt-6, lg:-mt-7, or lg:-mt-8), got: "${classNames}"`
  );
});

test("3. Upward shift is strictly NOT applied on mobile or tablet views", () => {
  const content = readHeroContent();
  const copyBlockMatch = content.match(/{\/\*\s*Copy\s*\*\/}\s*<motion\.div([^>]+)>/s);
  assert.ok(copyBlockMatch, "HeroSection must have motion.div opening tag for Copy");

  const classNames = copyBlockMatch[1];

  // Mobile/tablet must not have negative margin: no `-mt-` unless prefixed by `lg:`
  const nonDesktopNegativeMargin = /(?<!lg:)-mt-(?:6|7|8|\d+)/.test(classNames);
  assert.equal(
    nonDesktopNegativeMargin,
    false,
    "Negative top margin must not be applied on mobile or tablet (only lg: prefix allowed)"
  );

  // md: must not have negative margin
  assert.doesNotMatch(
    classNames,
    /md:-mt-/,
    "Tablet view (md:) must not have an upward shift"
  );
});

test("4. HeroSection background and section overlay layout remains intact with no regressions", () => {
  const content = readHeroContent();

  assert.ok(
    content.includes("-mt-16 pt-16"),
    "Section must preserve -mt-16 pt-16 navbar offset"
  );
  assert.ok(
    content.includes("py-16 md:py-20"),
    "Section inner container must preserve mobile py-16 and tablet md:py-20"
  );
  assert.ok(
    content.includes("islamic-pattern"),
    "Background pattern must remain intact"
  );
});
