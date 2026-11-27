import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("src");
const COMPONENT_PATH = path.join(SRC_DIR, "components", "WhatsAppFloatingButton.tsx");
const APP_PATH = path.join(SRC_DIR, "App.tsx");

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

test("1. WhatsAppFloatingButton component file exists", () => {
  const content = readFileSafe(COMPONENT_PATH);
  assert.ok(content !== null, "src/components/WhatsAppFloatingButton.tsx must exist");
  assert.ok(content.length > 50, "WhatsAppFloatingButton.tsx must have implementation content");
});

test("2. WhatsAppFloatingButton targets official WhatsApp number with English inquiry message", () => {
  const content = readFileSafe(COMPONENT_PATH);
  assert.ok(content, "Component content must be available");
  
  // Must target official number: 919128719875
  assert.ok(
    content.includes("919128719875"),
    "WhatsApp link must target official WhatsApp number 919128719875"
  );
  assert.ok(
    content.includes("wa.me/919128719875") || content.includes("https://wa.me/"),
    "Must use wa.me protocol link"
  );
  
  // English message verification
  assert.ok(
    content.includes("inquiry regarding Rishta Matrimony") ||
    content.includes("have an inquiry") ||
    content.includes("inquiry about Rishta Matrimony"),
    "Pre-filled message must be in English (e.g. 'Assalamu Alaikum! I have an inquiry regarding Rishta Matrimony.')"
  );
  assert.ok(
    !content.includes("ke bare me inquiry karni hai"),
    "Hindi/Hinglish phrase 'ke bare me inquiry karni hai' must be replaced with English"
  );
});

test("3. WhatsAppFloatingButton features an animated wave / ripple radiating from the main button", () => {
  const content = readFileSafe(COMPONENT_PATH);
  assert.ok(content, "Component content must be available");

  // Must have a wave/ripple ring radiating from the main button container
  const hasWavePing = content.includes("animate-ping") && content.includes("absolute inset-0");
  const hasWavePulse = content.includes("animate-pulse") || content.includes("-inset-");

  assert.ok(
    hasWavePing || hasWavePulse,
    "Floating circular button must have an animated wave/ripple effect radiating outwards (e.g. animate-ping with absolute inset-0)"
  );
  assert.ok(
    content.includes("bg-[#25D366]") || content.includes("bg-emerald-"),
    "Wave must use WhatsApp green brand color"
  );
});

test("4. WhatsAppFloatingButton has proper accessibility, secure link attributes, and fixed positioning", () => {
  const content = readFileSafe(COMPONENT_PATH);
  assert.ok(content, "Component content must be available");

  assert.ok(
    content.includes('target="_blank"') && content.includes("noopener"),
    "WhatsApp link must open in new tab with secure target='_blank' and rel='noopener noreferrer'"
  );
  assert.ok(
    content.includes("aria-label"),
    "Floating button must have an aria-label for accessibility"
  );
  assert.ok(
    content.includes("fixed") && (content.includes("bottom-") || content.includes("bottom-5")) && (content.includes("right-") || content.includes("right-5")),
    "Button must be fixed in the bottom-right corner"
  );
});

test("5. WhatsAppFloatingButton features a responsive inquiry pill/label and WhatsApp styling", () => {
  const content = readFileSafe(COMPONENT_PATH);
  assert.ok(content, "Component content must be available");

  assert.ok(
    content.includes("hidden sm:flex") || content.includes("hidden md:flex") || content.includes("sm:inline"),
    "Inquiry badge/label must be responsive so it doesn't block mobile screens"
  );
  assert.ok(
    content.includes("25D366") || content.includes("emerald-") || content.includes("green-"),
    "Button must have WhatsApp brand green styling"
  );
  assert.ok(
    content.includes("Inquiry") || content.includes("inquiry"),
    "Pill or label must mention Inquiry"
  );
});

test("6. App.tsx replaces IslamicAssistantWidget with WhatsAppFloatingButton", () => {
  const appContent = readFileSafe(APP_PATH);
  assert.ok(appContent, "src/App.tsx must exist");

  assert.ok(
    appContent.includes("WhatsAppFloatingButton"),
    "App.tsx must import and render WhatsAppFloatingButton"
  );
  assert.ok(
    !appContent.includes("<IslamicAssistantWidget />") && !appContent.includes("<IslamicAssistantWidget/>"),
    "App.tsx must not render the old IslamicAssistantWidget"
  );
});
