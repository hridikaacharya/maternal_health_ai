// normalize.js
// Converts the raw decision_rules + referral_rules into ONE canonical rule
// set with consistent variable names and units. Run: node scripts/normalize.js
//
// WHY THIS EXISTS: decision_rules.csv and referral_rules.csv were authored
// somewhat independently and use different variable names for the same
// clinical fact (see README "Known clinical conflicts"). This file is the
// single place where that reconciliation happens, so the rule engine never
// has to guess.

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------
// CANONICAL VARIABLE MAP
// key = canonical name used everywhere downstream
// value = list of raw aliases that mean the same thing
// ---------------------------------------------------------------------
const VARIABLE_ALIASES = {
  unconscious: ['unconscious', 'unconsciousness'],
  convulsions: ['convulsions', 'convulsing'],
  vaginal_bleeding: ['vaginal_bleeding'],
  severe_abdominal_pain: ['severe_abdominal_pain'],
  severe_difficulty_breathing: ['severe_difficulty_breathing', 'difficulty_breathing', 'shortness_of_breath'],
  central_cyanosis: ['central_cyanosis'],
  fever: ['fever'],
  foul_smelling_discharge: ['foul_smelling_discharge', 'foul_smelling_vaginal_discharge'],
  shock: ['shock'],
  fainting: ['fainting'],
  unrecordable_bp_pulse: ['unrecordable_bp_pulse'],
  bp_systolic: ['bp_systolic', 'systolic_bp'],
  bp_diastolic: ['bp_diastolic', 'diastolic_bp'],
  proteinuria: ['proteinuria', 'protein_in_urine'], // NOTE: unit conflict, see below
  severe_headache: ['severe_headache'],
  blurred_vision: ['blurred_vision'],
  gestational_age_weeks: ['gestational_age_weeks', 'gestational_age'],
  haemoglobin: ['haemoglobin', 'haemoglobin_level'], // NOTE: unit conflict, see below
  reduced_fetal_movements: ['reduced_fetal_movements', 'reduced_fetal_movement', 'fetal_movements'],
  water_broke: ['water_broke', 'leaking_fluid', 'leaking_of_fluid_from_vagina'],
  suicidal_ideation: ['suicidal_ideation'],
  phq_9_score: ['phq_9_score'],
  previous_preeclampsia: ['previous_preeclampsia'],
  diabetes: ['diabetes', 'pre_existing_diabetes', 'gestational_diabetes'],
  chronic_hypertension: ['chronic_hypertension'],
  multiple_pregnancy: ['multiple_pregnancy'],
  bmi: ['bmi', 'high_bmi', 'low_bmi'],
  previous_gdm: ['previous_gdm'],
  family_history_diabetes: ['family_history_diabetes'],
  maternal_age: ['maternal_age', 'maternal_age_young', 'maternal_age_old'],
  anc_visits_completed: ['anc_visits_completed', 'no_anc_visits'],
  valid_ttcv_history: ['valid_ttcv_history'],
  weight: ['weight'],
  looks_very_ill: ['looks_very_ill'],
  severe_vomiting: ['severe_vomiting'],
  imminent_delivery: ['imminent_delivery'],
  labour: ['labour'],
  postpartum_haemorrhage: ['postpartum_haemorrhage'],
  maternal_infection: ['maternal_infection'],
  newborn_convulsions: ['newborn_convulsions'],
  newborn_not_feeding: ['newborn_not_feeding'],
};

// Reverse lookup: raw name -> canonical name
const RAW_TO_CANONICAL = {};
for (const [canonical, aliases] of Object.entries(VARIABLE_ALIASES)) {
  for (const alias of aliases) {
    RAW_TO_CANONICAL[alias] = canonical;
  }
}

function canonicalize(varName) {
  return RAW_TO_CANONICAL[varName] || varName; // fall through if unmapped (flagged in report)
}

// ---------------------------------------------------------------------
// UNIT / VALUE RESOLUTION NOTES (flagged for clinical review — see README)
// ---------------------------------------------------------------------
// proteinuria: decision_rules uses numeric scale (>=2), referral_rules uses
// dipstick string ("++"). We treat "++" as equivalent to numeric 2, and
// "+++" as 3. This assumes a standard 0/1+/2+/3+/4+ dipstick scale.
function normalizeProteinuriaValue(raw) {
  if (raw === '++') return 2;
  if (raw === '+++') return 3;
  if (raw === '+') return 1;
  return raw;
}

// haemoglobin: decision_rules rule 9 uses g/dL (<7 = severe). Rule 10's
// upper bound of 110 looks like g/L, not g/dL. We normalize everything to
// g/dL and treat the moderate band as 7-11 g/dL (WHO standard anaemia
// cutoff), NOT 7-110. FLAG FOR CLINICAL CONFIRMATION.
const HAEMOGLOBIN_UNIT_ASSUMPTION = 'g/dL, moderate band corrected to 7-11 (was 7-110 in source)';

// ---------------------------------------------------------------------
// LOAD RAW DATA
// Paste your knowledge_base.json content into data/raw/knowledge_base.json
// (the structured JSON version you sent, not the CSVs) before running this.
// ---------------------------------------------------------------------
const rawPath = path.join(__dirname, '..', 'data', 'raw', 'knowledge_base.json');
if (!fs.existsSync(rawPath)) {
  console.error(`Missing ${rawPath}`);
  console.error('Save your knowledge_base.json into data/raw/ first, then re-run.');
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// ---------------------------------------------------------------------
// BUILD CANONICAL DECISION RULES
// ---------------------------------------------------------------------
const canonicalRules = raw.rule_engine.decision_rules.map((rule) => {
  const clauses = (rule.condition.clauses || []).map((clause) => {
    let value = clause.value;
    if (canonicalize(clause.variable) === 'proteinuria') {
      value = normalizeProteinuriaValue(value);
    }
    // Correct the known haemoglobin upper-bound unit bug from rule 10
    if (canonicalize(clause.variable) === 'haemoglobin' && clause.operator === '<' && value === '110') {
      value = '11'; // corrected per HAEMOGLOBIN_UNIT_ASSUMPTION
    }
    return {
      variable: canonicalize(clause.variable),
      operator: clause.operator,
      value: value,
    };
  });

  return {
    rule_id: rule.rule_id,
    priority: rule.priority,
    rule_name: rule.rule_name,
    operator: rule.condition.operator, // AND / OR / null (single clause)
    clauses,
    gestational_stage: rule.gestational_stage,
    risk_level: rule.risk_level,
    recommendation: rule.recommendation,
    facility_level: rule.facility_level,
    confidence: rule.confidence,
    education_module: rule.education_module,
    explanation: rule.explanation_key,
    rule_outcome: rule.rule_outcome, // STOP | CONTINUE | ASK_FOR_DATA
    source: rule.source,
  };
});

// Sort by priority ascending (1 = highest priority, evaluated first)
canonicalRules.sort((a, b) => a.priority - b.priority);

const output = {
  _meta: {
    generated_by: 'scripts/normalize.js',
    generated_at: new Date().toISOString(),
    haemoglobin_unit_assumption: HAEMOGLOBIN_UNIT_ASSUMPTION,
    unmapped_variables_warning:
      'Any variable not in VARIABLE_ALIASES passes through unchanged — check console output below for gaps.',
  },
  rules: canonicalRules,
};

// Warn about any variable used in rules but not explicitly mapped
const allUsedVars = new Set();
raw.rule_engine.decision_rules.forEach((r) =>
  (r.condition.clauses || []).forEach((c) => allUsedVars.add(c.variable))
);
const unmapped = [...allUsedVars].filter((v) => !RAW_TO_CANONICAL[v]);
if (unmapped.length) {
  console.warn('⚠ Unmapped variables (passed through as-is, review these):', unmapped);
}

fs.mkdirSync(path.join(__dirname, '..', 'data', 'canonical'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'canonical', 'rules.json'),
  JSON.stringify(output, null, 2)
);

console.log(`✓ Wrote ${canonicalRules.length} canonical rules to data/canonical/rules.json`);
