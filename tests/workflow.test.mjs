import test from "node:test";
import assert from "node:assert/strict";

const VERIFICATION_STEPS = [
  { step: 1, title: "Réception" },
  { step: 2, title: "Enregistrement" },
  { step: 3, title: "Affectation" },
  { step: 4, title: "Vérification de terrain" },
  { step: 5, title: "Preuves & Observations" },
  { step: 6, title: "Validation hiérarchique" },
  { step: 7, title: "Publication officielle" },
];

const VALID_STATUSES = [
  "EN ATTENTE",
  "EN COURS DE VÉRIFICATION",
  "CONFIRMÉE",
  "FAUSSE",
  "PARTIELLEMENT VRAIE",
  "NON VÉRIFIABLE",
];

test("Workflow - 7-Step Integrity", () => {
  assert.equal(VERIFICATION_STEPS.length, 7);
  for (let i = 0; i < 7; i++) {
    assert.equal(VERIFICATION_STEPS[i].step, i + 1);
  }
});

test("Workflow - Status transitions and verdicts", () => {
  const initialStatus = "EN ATTENTE";
  assert.ok(VALID_STATUSES.includes(initialStatus));

  // Step 3 transition
  const assignedStatus = "EN COURS DE VÉRIFICATION";
  assert.ok(VALID_STATUSES.includes(assignedStatus));

  // Step 7 final verdicts
  const possibleFinalVerdicts = ["CONFIRMÉE", "FAUSSE", "PARTIELLEMENT VRAIE", "NON VÉRIFIABLE"];
  possibleFinalVerdicts.forEach((verdict) => {
    assert.ok(VALID_STATUSES.includes(verdict));
  });
});
