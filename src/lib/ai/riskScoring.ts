import type { ScreeningInput } from '../rule-engine/types';

export interface RiskScore {
  score: number;
  level: "Low" | "Moderate" | "High" | "Emergency";
  factors: string[];
}


export function calculateRiskScore(
  input: ScreeningInput
): RiskScore {

  let score = 0;
  const factors:string[] = [];


  if (input.bp_systolic &&
      Number(input.bp_systolic) >= 140) {
    score += 25;
    factors.push("Elevated blood pressure");
  }


  if (input.bp_diastolic &&
      Number(input.bp_diastolic) >= 90) {
    score += 25;
    factors.push("High diastolic blood pressure");
  }


  if (input.vaginal_bleeding === "yes") {
    score += 40;
    factors.push("Vaginal bleeding");
  }


  if (input.convulsions === "yes") {
    score += 50;
    factors.push("Convulsions");
  }


  let level:
    RiskScore["level"];


  if(score >= 50){
    level="Emergency";
  }
  else if(score >=30){
    level="High";
  }
  else if(score >=15){
    level="Moderate";
  }
  else{
    level="Low";
  }


  return {
    score,
    level,
    factors
  };
}