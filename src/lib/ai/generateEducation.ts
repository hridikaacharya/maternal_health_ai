import type { Rule } from "@/lib/rule-engine/types";
import { generateLocalEducation } from "./localEducation";

export async function generateEducation(
  rule: Rule
) {
  return generateLocalEducation(rule);
}