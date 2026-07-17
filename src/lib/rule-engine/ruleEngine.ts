import rulesData from '../../data/canonical/rules.json' with { type: 'json' };

import type {
  CanonicalRulesFile,
  Rule,
  ScreeningInput,
  ScreeningResult
} from './types';

const rules = (rulesData as CanonicalRulesFile).rules;

function normalizeValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }

  return value;
}

function compareValues(actual: unknown, expected: unknown) {
  const actualNum = Number(
    String(actual).replace('+', '')
  );

  const expectedNum = Number(
    String(expected).replace('+', '')
  );

  if (!Number.isNaN(actualNum) && !Number.isNaN(expectedNum)) {
    return actualNum - expectedNum;
  }

  return String(actual).localeCompare(String(expected));
}

function evaluateClause(
  input: ScreeningInput,
  variable: string,
  operator: string,
  expected: string | number
) {
  const actual = input[variable];

  if (actual === undefined || actual === null) {
    return false;
  }

  const normalizedActual = normalizeValue(actual);
  const normalizedExpected = normalizeValue(expected);

 switch (operator) {
    case '=':
    case '==':
      return normalizedActual === normalizedExpected;

    case '>':
      return compareValues(actual, expected) > 0;

    case '<':
      return compareValues(actual, expected) < 0;

    case '>=':
      return compareValues(actual, expected) >= 0;

    case '<=':
      return compareValues(actual, expected) <= 0;

    default:
      return false;
  }
  }   //

function evaluateRule(
  rule: Rule,
  input: ScreeningInput
) {
  const results = rule.clauses.map(clause =>
    evaluateClause(
      input,
      clause.variable,
      clause.operator,
      clause.value
    )
  );

  if (rule.operator === 'OR') {
    return results.some(Boolean);
  }

  if (rule.operator === 'AND') {
    return results.every(Boolean);
  }

  return results[0] ?? false;
}

export function runScreening(
  input: ScreeningInput
): ScreeningResult {

  const matched = rules.filter(rule =>
    evaluateRule(rule, input)
  );


  const primary =
    matched.sort(
      (a,b) =>
        a.priority - b.priority
    )[0] ?? null;


  return {
    matched,
    primary,
    inputEvaluated: input
  };
}