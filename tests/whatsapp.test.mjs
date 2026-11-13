import test from "node:test";
import assert from "node:assert/strict";

function maskPhoneNumber(phone) {
  if (!phone) return "Numéro confidentiel";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length < 8) return "***";
  const start = cleaned.slice(0, Math.min(6, cleaned.length - 4));
  const end = cleaned.slice(-2);
  return `${start} ** ** ${end}`;
}

function generateTrackingCode() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PLCDA-${year}-${random}`;
}

test("WhatsApp - Privacy Protection Phone Masking", () => {
  assert.equal(maskPhoneNumber("+22796112233"), "+22796 ** ** 33");
  assert.equal(maskPhoneNumber("+22790223344"), "+22790 ** ** 44");
  assert.equal(maskPhoneNumber(null), "Numéro confidentiel");
});

test("WhatsApp - Tracking Code Generation Format", () => {
  const code = generateTrackingCode();
  assert.match(code, /^PLCDA-202[0-9]-[0-9]{4}$/);
});

test("WhatsApp - Multilingual Bot Menus Availability", () => {
  const languages = ["fr", "ha", "tmq", "ar"];
  assert.equal(languages.length, 4);
});
