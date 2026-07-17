import type {

ScreeningInput

} from "@/lib/rule-engine/types";


export function getFollowUpQuestions(

input:ScreeningInput

){

const q:string[]=[];


if(input.gestational_age===undefined){

q.push("How many weeks pregnant are you?");

}


if(input.vaginal_bleeding==="yes"){

q.push(
"How much bleeding are you experiencing? Is it spotting, moderate bleeding, or heavy bleeding?"
);

}


if(

input.severe_headache==="yes"&&

input.bp_systolic===undefined

){

q.push(
"Do you know your blood pressure reading?"
);

}


if(

input.bp_systolic!==undefined&&

input.bp_diastolic!==undefined&&

input.bp_systolic>=140

){

q.push(
"Are you having blurred vision or swelling?"
);

}


if(

input.reduced_fetal_movements==="yes"

){

q.push(
"When did you last feel the baby move normally?"
);

}


return q;

}