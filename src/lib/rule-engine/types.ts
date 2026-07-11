export type ClauseOperator = '=' | '==' | '>=' | '<=' | '>' | '<';
export type RuleOperator = 'AND' | 'OR' | null;
export type RuleOutcome = 'STOP' | 'CONTINUE' | 'ASK_FOR_DATA' | string;

export interface Clause {
  variable: string;
  operator: ClauseOperator;
  value: string | number;
}

export interface RuleSource {
  citations: string[];
  pages: string[];
}

export interface Rule {
  rule_id: number;
  priority: number;
  rule_name: string;
  operator: RuleOperator;
  clauses: Clause[];
  gestational_stage: string;
  risk_level: string;
  recommendation: string;
  facility_level: string;
  confidence: string;
  education_module: string;
  explanation: string;
  rule_outcome: RuleOutcome;
  source: RuleSource;
}

export interface ScreeningInput {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ScreeningResult {
  matched: Rule[];
  primary: Rule | null;
  inputEvaluated: ScreeningInput;
}

export interface CanonicalRulesFile {
  _meta: {
    generated_by: string;
    generated_at: string;
    haemoglobin_unit_assumption: string;
    unmapped_variables_warning: string;
  };
  rules: Rule[];
}