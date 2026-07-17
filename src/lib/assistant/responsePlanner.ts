import type {

Rule,
ScreeningInput

} from "@/lib/rule-engine/types";

import {

calculateRisk

} from "./riskScore";

import {

buildEvidence

} from "./evidenceEngine";

import {

generateLocalResponse

} from "@/lib/ai/localAssistant";

import {

getFollowUpQuestions

} from "./followUp";

export function buildAssistantResponse(

rule:Rule|null,

screeningInput:ScreeningInput

){

if(!rule){

return{

text:

"I couldn't identify a specific condition yet. Could you tell me more about your symptoms?",

risk:null,

evidence:[]

};

}

const clinical=

generateLocalResponse(

rule,

screeningInput

);

const risk=

calculateRisk(rule);

const evidence=

buildEvidence(rule);

const questions=

getFollowUpQuestions(

screeningInput

);

let text=

`${clinical.summary}

${clinical.explanation}

Risk Level:
${risk.level}

Risk Score:
${risk.score}/100

Recommendation:
${clinical.recommendation}

Facility:
${clinical.facility}`;

if(questions.length){

text+=

"\n\nQuestions:\n";

text+=questions

.map(

(q,i)=>

`${i+1}. ${q}`

)

.join("\n");

}

if(evidence.length){

text+=

"\n\nEvidence:\n";

text+=evidence

.map(

e=>

`${e.citation} (Page ${e.page})`

)

.join("\n");

}

return{

text,

risk,

evidence

};

}