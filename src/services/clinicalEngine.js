// src/services/clinicalEngine.js
//
// Deterministic clinical rule engine.
//
// This file contains ZERO calls to any AI model, on purpose. Every triage
// decision is the direct result of explicit, auditable conditional logic, so
// the same inputs always produce the same clinical output — no hallucination
// risk, no model drift, and a reviewer can trace exactly why a result fired.
//
// Rules are checked in order of clinical urgency. The first matching rule
// wins and the function returns immediately.

export const RISK = {
  LOW: 'LOW RISK',
  URGENT: 'URGENT',
  EMERGENCY: 'EMERGENCY',
};

export const PRIMARY_DANGER_SIGNS = [
  'Vaginal bleeding',
  'Severe headache',
  'Blurred vision',
  'Convulsions',
  'Severe abdominal pain',
];

/**
 * @param {object} data
 * @param {number|string} data.weeksPregnant
 * @param {string[]} data.symptoms
 * @param {string|number} data.ancVisits
 * @param {string} data.bloodPressureSys
 * @param {string} data.bloodPressureDia
 * @returns {{ riskLevel: string, action: string, reason: string, ruleId: string }}
 */
export function evaluateClinicalRisk(data) {
  const weeks = Number(data.weeksPregnant);
  const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
  const ancVisits = Number(data.ancVisits);

  // Rule 1 — Immediate obstetric danger sign.
  const dangerSign = symptoms.find((s) => PRIMARY_DANGER_SIGNS.includes(s));
  if (dangerSign) {
    return {
      riskLevel: RISK.EMERGENCY,
      action: 'Go to the nearest hospital immediately.',
      reason: `Reported sign — "${dangerSign}" — is a recognized obstetric emergency indicator.`,
      ruleId: 'RULE-1-DANGER-SIGN',
    };
  }

  // Rule 2 — Third-trimester fever (infection risk).
  if (weeks >= 28 && symptoms.includes('Fever')) {
    return {
      riskLevel: RISK.URGENT,
      action: 'Visit your local health post within 24 hours.',
      reason: 'Fever in the third trimester requires prompt evaluation for infection risk.',
      ruleId: 'RULE-2-THIRD-TRIMESTER-FEVER',
    };
  }

  // Rule 3 — No documented antenatal care by the third trimester.
  if (weeks >= 32 && (Number.isNaN(ancVisits) || ancVisits === 0)) {
    return {
      riskLevel: RISK.URGENT,
      action: 'Schedule an emergency antenatal care (ANC) appointment within 24 hours.',
      reason: 'Third trimester reached with no documented baseline antenatal visits.',
      ruleId: 'RULE-3-NO-ANC-THIRD-TRIMESTER',
    };
  }

  // Rule 4 — Missing baseline metrics, otherwise asymptomatic.
  const missingBP = !data.bloodPressureSys || !data.bloodPressureDia;
  if (missingBP && symptoms.length === 0) {
    return {
      riskLevel: RISK.LOW,
      action: 'Continue routine monitoring. Record blood pressure at your next visit.',
      reason: 'No active symptoms reported. Baseline blood pressure has not yet been recorded.',
      ruleId: 'RULE-4-MISSING-BASELINE',
    };
  }

  // Default — nothing above triggered.
  return {
    riskLevel: RISK.LOW,
    action: 'Continue your regular antenatal care schedule.',
    reason: 'Reported values fall within expected baseline ranges for this stage of pregnancy.',
    ruleId: 'RULE-0-BASELINE',
  };
}

export function isWeeksValid(weeksPregnant) {
  const w = Number(weeksPregnant);
  return Number.isFinite(w) && w >= 1 && w <= 42;
}

// Maps a risk level to a 0–100 position on the elevation band used in
// TriageOutput, so the UI layer never has to know the rule engine's internals.
export function riskToElevation(riskLevel) {
  switch (riskLevel) {
    case RISK.EMERGENCY:
      return 88;
    case RISK.URGENT:
      return 52;
    default:
      return 14;
  }
}
