import rulesData from '../../data/canonical/rules.json';

import type { Clause, CanonicalRulesFile, Rule, ScreeningInput, ScreeningResult } from './types';

export function loadRules(): Rule[] {
  return (rulesData as CanonicalRulesFile).rules;
}

export function evaluateClause(clause: Clause, input: ScreeningInput): boolean {
  const inputValue = input[clause.variable];

  if (inputValue === undefined || inputValue === null) {
    if (clause.value === 'unknown') return true;
    return false;
  }

  const a = inputValue;
  const b = Number.isNaN(Number(clause.value)) ? clause.value : Number(clause.value);
  const aNum = Number.isNaN(Number(a)) ? null : Number(a);
  const bNum = typeof b === 'number' ? b : Number(b);

  switch (clause.operator) {
    case '=':
    case '==':
      return String(a).toLowerCase() === String(b).toLowerCase();
    case '>=':
      return aNum !== null && aNum >= bNum;
    case '<=':
      return aNum !== null && aNum <= bNum;
    case '>':
      return aNum !== null && aNum > bNum;
    case '<':
      return aNum !== null && aNum < bNum;
    default:
      return false;
  }
}

export function evaluateRule(rule: Rule, input: ScreeningInput): boolean {
  const results = rule.clauses.map((clause) => evaluateClause(clause, input));
  if (rule.operator === 'OR') return results.some(Boolean);
  if (rule.operator === 'AND') return results.every(Boolean);
  return results[0] ?? false;
}

export function runScreening(input: ScreeningInput): ScreeningResult {
  const rules = loadRules();
  const matched: Rule[] = [];

  for (const rule of rules) {
    if (evaluateRule(rule, input)) {
      matched.push(rule);
      if (rule.rule_outcome === 'STOP') {
        break;
      }
    }
  }

  return {
    matched,
    primary: matched[0] || null,
    inputEvaluated: input
  };
}