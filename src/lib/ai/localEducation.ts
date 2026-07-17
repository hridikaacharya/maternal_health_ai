import type { Rule } from "@/lib/rule-engine/types";

export function generateLocalEducation(rule: Rule) {
  return {
    summary: rule.explanation,

    why:
      "This recommendation is based on the warning signs identified during the assessment.",

    what_to_do_now:
      rule.recommendation,

    warning_signs: [
      "Heavy bleeding",
      "Severe abdominal pain",
      "Convulsions",
      "Difficulty breathing"
    ]
  };
}