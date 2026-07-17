import type { Rule } from "@/lib/rule-engine/types";

export interface RiskAssessment {

  score:number;

  level:
    | "Routine"
    | "Urgent"
    | "Emergency";

}

export function calculateRisk(

rule:Rule|null

):RiskAssessment{

if(!rule){

return{

score:5,

level:"Routine"

};

}

switch(rule.risk_level){

case "Emergency":

return{

score:95,

level:"Emergency"

};

case "Urgent":

return{

score:70,

level:"Urgent"

};

default:

return{

score:30,

level:"Routine"

};

}

}