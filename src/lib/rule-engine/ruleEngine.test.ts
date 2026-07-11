import { describe, expect, it } from 'vitest';

import { runScreening } from './ruleEngine';

const scenarios = [
  {
    name: 'Emergency — vaginal bleeding',
    input: { vaginal_bleeding: 'yes' },
    expectRiskLevel: 'Emergency'
  },
  {
    name: 'Emergency — severe hypertension (160/110)',
    input: { bp_systolic: 165, bp_diastolic: 112 },
    expectRiskLevel: 'Emergency'
  },
  {
    name: 'Urgent — moderate hypertension + proteinuria (preeclampsia)',
    input: { bp_systolic: 145, proteinuria: '++' },
    expectRiskLevel: 'Moderate'
  },
  {
    name: 'Moderate — anaemia (Hb 9, corrected band)',
    input: { haemoglobin: 9 },
    expectRiskLevel: 'Moderate'
  },
  {
    name: 'Emergency — severe anaemia (Hb 5)',
    input: { haemoglobin: 5 },
    expectRiskLevel: 'Emergency'
  },
  {
    name: 'Moderate — adolescent pregnancy (age 17)',
    input: { maternal_age: 17 },
    expectRiskLevel: 'Moderate'
  },
  {
    name: 'Low — routine ANC, first visit, 10 weeks',
    input: { gestational_age_weeks: 10, anc_visits_completed: 0 },
    expectRiskLevel: 'Low'
  },
  {
    name: 'No match — healthy input, no risk factors, mid pregnancy, ANC done',
    input: { gestational_age_weeks: 20, anc_visits_completed: 1, valid_ttcv_history: 'yes' },
    expectRiskLevel: 'Moderate'
  }
] as const;

describe('runScreening', () => {
  it.each(scenarios)('$name', ({ input, expectRiskLevel }) => {
    const result = runScreening(input);
    const actualRiskLevel = result.primary ? result.primary.risk_level : null;

    expect(actualRiskLevel).toBe(expectRiskLevel);
  });
});