import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("src");
const COMPONENTS_DIR = path.join(SRC_DIR, "components");
const PAGES_DIR = path.join(SRC_DIR, "pages");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

test("1. Global CSS enforces overflow-x-hidden on body to prevent horizontal scrollbars on mobile", () => {
  const css = readFile(path.join(SRC_DIR, "index.css"));
  const bodyBlockMatch = css.match(/body\s*\{([^}]+)\}/s);
  assert.ok(bodyBlockMatch, "index.css must define a body block");
  const bodyRules = bodyBlockMatch[1];
  assert.ok(
    bodyRules.includes("overflow-x-hidden"),
    "body in index.css must include overflow-x-hidden to prevent horizontal scrolling"
  );
});

test("2. Landing Page main sections have standard breathing room (py-16 md:py-24)", () => {
  const sectionsToCheck = [
    { file: "FeaturedProfilesSection.tsx", name: "FeaturedProfilesSection" },
    { file: "HowToJoinSection.tsx", name: "HowToJoinSection" },
    { file: "WhyChooseUsSection.tsx", name: "WhyChooseUsSection" },
    { file: "SuccessAndTrustSection.tsx", name: "SuccessAndTrustSection" },
    { file: "PremiumSection.tsx", name: "PremiumSection" },
    { file: "CommunityLinksSection.tsx", name: "CommunityLinksSection" },
    { file: "FAQSection.tsx", name: "FAQSection" },
  ];

  for (const { file, name } of sectionsToCheck) {
    const content = readFile(path.join(COMPONENTS_DIR, file));
    const sectionTagMatch = content.match(/<section[^>]*className=["']([^"']+)["']/);
    assert.ok(sectionTagMatch, `${name} must have a <section> tag with className`);
    const classNames = sectionTagMatch[1];
    
    const hasStandardPy = 
      (classNames.includes("py-16") && (classNames.includes("md:py-24") || classNames.includes("lg:py-24"))) ||
      classNames.includes("py-16 md:py-24");

    assert.ok(
      hasStandardPy,
      `${name} section must have standard breathing room (py-16 md:py-24), got: "${classNames}"`
    );
  }
});

test("3. Container Uniformity: Landing sections use max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", () => {
  const landingSections = [
    "FeaturedProfilesSection.tsx",
    "HowToJoinSection.tsx",
    "WhyChooseUsSection.tsx",
    "SuccessAndTrustSection.tsx",
    "CommunityLinksSection.tsx",
    "FAQSection.tsx"
  ];

  for (const file of landingSections) {
    const content = readFile(path.join(COMPONENTS_DIR, file));
    const hasStandardContainer = 
      content.includes("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8") ||
      (content.includes("max-w-7xl") && content.includes("mx-auto") && (content.includes("px-4") || content.includes("px-5") || content.includes("px-6")));

    assert.ok(
      hasStandardContainer,
      `${file} must use standard uniform max-w-7xl container`
    );
  }
});

test("4. Cards & Grids follow standard 8-point grid gaps and padding", () => {
  const whyChooseUs = readFile(path.join(COMPONENTS_DIR, "WhyChooseUsSection.tsx"));
  assert.ok(
    whyChooseUs.includes("gap-6 md:gap-8") || whyChooseUs.includes("gap-4 md:gap-6 lg:gap-8") || whyChooseUs.includes("gap-6 lg:gap-8"),
    "WhyChooseUs grid must follow standardized 8-point gap (gap-6 md:gap-8 or responsive 8-pt variant)"
  );

  const featured = readFile(path.join(COMPONENTS_DIR, "FeaturedProfilesSection.tsx"));
  assert.ok(
    featured.includes("gap-4 md:gap-6 lg:gap-8") || featured.includes("gap-6 md:gap-8") || featured.includes("gap-4 sm:gap-6 lg:gap-8"),
    "FeaturedProfiles grid must follow 8-point system"
  );
});

test("5. Heading to subheading vertical rhythm is tight (8px-12px / mb-2 to mb-3)", () => {
  const howToJoin = readFile(path.join(COMPONENTS_DIR, "HowToJoinSection.tsx"));
  const whyChooseUs = readFile(path.join(COMPONENTS_DIR, "WhyChooseUsSection.tsx"));

  // Check that heading/subheadings don't have excessive or inconsistent gaps
  assert.ok(
    howToJoin.includes("mb-2") || howToJoin.includes("mt-2") || howToJoin.includes("space-y-2"),
    "HowToJoin heading rhythm must be tight (mb-2/mt-2)"
  );
  assert.ok(
    whyChooseUs.includes("mt-2") || whyChooseUs.includes("mb-2") || whyChooseUs.includes("space-y-2"),
    "WhyChooseUs heading rhythm must be tight (mt-2/mb-2)"
  );
});

test("6. Inner Pages maintain container uniformity and standard breathing room", () => {
  const pricing = readFile(path.join(PAGES_DIR, "Pricing.tsx"));
  assert.ok(
    pricing.includes("max-w-7xl mx-auto"),
    "Pricing page must use max-w-7xl mx-auto container"
  );

  const profiles = readFile(path.join(PAGES_DIR, "Profiles.tsx"));
  assert.ok(
    profiles.includes("max-w-7xl mx-auto"),
    "Profiles page must use max-w-7xl mx-auto container"
  );

  const terms = readFile(path.join(PAGES_DIR, "Terms.tsx"));
  assert.ok(
    terms.includes("max-w-7xl mx-auto") || terms.includes("max-w-4xl mx-auto"),
    "Terms page must use centered container"
  );
});
