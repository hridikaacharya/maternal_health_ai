import type { Rule } from "@/lib/rule-engine/types";


export function buildEvidence(
  rule: Rule | null
) {

  if (!rule) {

    return [];

  }


  if (!rule.source) {

    return [];

  }


  return rule.source.citations.map(
    (citation, index) => ({

      citation,

      page:
        rule.source.pages?.[index] ?? ""

    })
  );

}