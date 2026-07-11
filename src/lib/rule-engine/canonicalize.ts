import type { CanonicalRulesFile, Clause, Rule, RuleOperator } from './types';

export const VARIABLE_ALIASES: Record<string, readonly string[]> = {
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
  proteinuria: ['proteinuria', 'protein_in_urine'],
  severe_headache: ['severe_headache'],
  blurred_vision: ['blurred_vision'],
  gestational_age_weeks: ['gestational_age_weeks', 'gestational_age'],
  haemoglobin: ['haemoglobin', 'haemoglobin_level'],
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
  newborn_not_feeding: ['newborn_not_feeding']
};

export const RAW_TO_CANONICAL: Record<string, string> = Object.entries(VARIABLE_ALIASES).reduce(
  (mapping, [canonical, aliases]) => {
    for (const alias of aliases) {
      mapping[alias] = canonical;
    }
    return mapping;
  },
  {} as Record<string, string>
);

export function canonicalize(varName: string): string {
  return RAW_TO_CANONICAL[varName] || varName;
}

export function normalizeProteinuriaValue(raw: string | number): string | number {
  if (raw === '++') return 2;
  if (raw === '+++') return 3;
  if (raw === '+') return 1;
  return raw;
}

const HAEMOGLOBIN_UNIT_ASSUMPTION = 'g/dL, moderate band corrected to 7-11 (was 7-110 in source)';

export function normalizeRuleSet(rawRules: {
  rule_engine: {
    decision_rules: Array<{
      rule_id: number;
      priority: number;
      rule_name: string;
      condition: { operator: string | null; clauses?: Clause[] };
      gestational_stage: string;
      risk_level: string;
      recommendation: string;
      facility_level: string;
      confidence: string;
      education_module: string;
      explanation_key: string;
      rule_outcome: string;
      source: Rule['source'];
    }>;
  };
}): CanonicalRulesFile {
  const canonicalRules = rawRules.rule_engine.decision_rules.map((rule) => {
    const clauses = (rule.condition.clauses || []).map((clause) => {
      let value = clause.value;
      if (canonicalize(clause.variable) === 'proteinuria') {
        value = normalizeProteinuriaValue(value);
      }
      if (canonicalize(clause.variable) === 'haemoglobin' && clause.operator === '<' && value === '110') {
        value = '11';
      }
      return {
        variable: canonicalize(clause.variable),
        operator: clause.operator,
        value
      };
    });

    return {
      rule_id: rule.rule_id,
      priority: rule.priority,
      rule_name: rule.rule_name,
      operator: rule.condition.operator as RuleOperator,
      clauses,
      gestational_stage: rule.gestational_stage,
      risk_level: rule.risk_level,
      recommendation: rule.recommendation,
      facility_level: rule.facility_level,
      confidence: rule.confidence,
      education_module: rule.education_module,
      explanation: rule.explanation_key,
      rule_outcome: rule.rule_outcome,
      source: rule.source
    } satisfies Rule;
  });

  canonicalRules.sort((a, b) => a.priority - b.priority);

  return {
    _meta: {
      generated_by: 'lib/rule-engine/canonicalize.ts',
      generated_at: new Date().toISOString(),
      haemoglobin_unit_assumption: HAEMOGLOBIN_UNIT_ASSUMPTION,
      unmapped_variables_warning: 'Any variable not in VARIABLE_ALIASES passes through unchanged — check console output below for gaps.'
    },
    rules: canonicalRules
  };
}