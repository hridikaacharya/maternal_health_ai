import type { Rule, ScreeningInput } from "@/lib/rule-engine/types";


function formatTrigger(rule: Rule, input: ScreeningInput) {

  const triggers = rule.clauses
    .filter(clause =>
      input[clause.variable] !== undefined
    )
    .map(clause => {

      const value =
        input[clause.variable];

      return `${clause.variable} ${clause.operator} ${value}`;

    });


  if (triggers.length === 0) {
    return "The recommendation was generated from the clinical criteria matched.";
  }


  return `The following findings matched:
${triggers.join("\n")}`;
}

function buildSummary(
  rule: Rule,
  input: ScreeningInput
) {

  const findings = [];


  if (input.gestational_age) {
    findings.push(
      `${input.gestational_age} weeks pregnant`
    );
  }


  if (input.bp_systolic) {
    findings.push(
      `blood pressure ${input.bp_systolic}/${input.bp_diastolic ?? ""}`
    );
  }


  if (input.severe_headache === "yes") {
    findings.push(
      "severe headache"
    );
  }


  if (findings.length === 0) {
    return `I noticed findings related to ${rule.rule_name}.`;
  }


  return (
    `Based on what you shared (${findings.join(", ")}), ` +
    `I noticed findings related to ${rule.rule_name}.`
  );

}

export function generateLocalResponse(
  rule: Rule,
  input: ScreeningInput
) {

  return {

    summary:
  buildSummary(rule, input),

    explanation:
      `${rule.explanation}

${formatTrigger(rule, input)}`,

    recommendation:
      rule.recommendation,

    urgency:
      rule.risk_level,

    facility:
      rule.facility_level

  };

}