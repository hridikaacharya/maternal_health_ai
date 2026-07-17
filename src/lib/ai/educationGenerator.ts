import type { Rule, ScreeningInput } from "@/lib/rule-engine/types";

export function buildEducationPrompt(
  rule: Rule,
  input: ScreeningInput
) {
  return `
You are a maternal health educator.

Patient findings:
${JSON.stringify(input, null, 2)}

Triggered condition:
${rule.rule_name}

Risk:
${rule.risk_level}

Recommendation:
${rule.recommendation}

Explain in simple language.

Output JSON:

{
 "summary":"",
 "why":"",
 "what_to_do_now":"",
 "warning_signs":[]
}

Use fewer than 120 words.
`;
}