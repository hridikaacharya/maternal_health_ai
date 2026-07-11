// ruleEngine.js
// Deterministic, auditable rule evaluator. No ML / no black box — every
// output traces to a specific rule_id and source citation. This is a
// deliberate safety choice for a clinical screening tool.

const fs = require('fs');
const path = require('path');

function loadRules() {
  const p = path.join(__dirname, '..', 'data', 'canonical', 'rules.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  return data.rules;
}

// Evaluate a single clause against the input object.
// Returns true/false. Unknown/missing input values evaluate to false
// (fail-safe: a rule never fires on data it doesn't have), EXCEPT for
// rule_outcome === 'ASK_FOR_DATA' rules, which specifically check for
// missing data and should fire when a value is absent.
function evaluateClause(clause, input) {
  const inputValue = input[clause.variable];

  if (inputValue === undefined || inputValue === null) {
    // "= unknown" clauses are checking for missing data on purpose
    if (clause.value === 'unknown') return true;
    return false;
  }

  const a = inputValue;
  const b = isNaN(Number(clause.value)) ? clause.value : Number(clause.value);
  const aNum = isNaN(Number(a)) ? null : Number(a);

  switch (clause.operator) {
    case '=':
    case '==':
      return String(a).toLowerCase() === String(b).toLowerCase();
    case '>=':
      return aNum !== null && aNum >= b;
    case '<=':
      return aNum !== null && aNum <= b;
    case '>':
      return aNum !== null && aNum > b;
    case '<':
      return aNum !== null && aNum < b;
    default:
      return false;
  }
}

function evaluateRule(rule, input) {
  const results = rule.clauses.map((c) => evaluateClause(c, input));
  if (rule.operator === 'OR') return results.some(Boolean);
  if (rule.operator === 'AND') return results.every(Boolean);
  // single clause, no boolean operator
  return results[0];
}

// Runs all rules in priority order. STOP rules halt further evaluation
// once matched (this mirrors the "next_step" logic in the source data —
// an emergency shouldn't be buried under five more questions).
// Returns { matched: [...rules that fired], primary: highest-priority match }
function runScreening(input) {
  const rules = loadRules();
  const matched = [];

  for (const rule of rules) {
    if (evaluateRule(rule, input)) {
      matched.push(rule);
      if (rule.rule_outcome === 'STOP') {
        break; // emergency found — stop evaluating lower-priority rules
      }
    }
  }

  return {
    matched,
    primary: matched[0] || null, // highest priority match, since rules are pre-sorted
    inputEvaluated: input,
  };
}

module.exports = { loadRules, evaluateRule, runScreening };
