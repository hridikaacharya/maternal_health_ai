import { CLINICAL_DICTIONARY } from "./clinicalDictionary";
export interface ClinicalEntities {

  gestational_age?: number;

  bp_systolic?: number;

  bp_diastolic?: number;

  severe_headache?: "yes";

  blurred_vision?: "yes";

  vaginal_bleeding?: "yes";

  severe_abdominal_pain?: "yes";

  fever?: "yes";

  swelling?: "yes";

  diabetes?: "yes";

  twins?: "yes";

  first_pregnancy?: "yes";

  reduced_fetal_movements?: "yes";

}


export function extractClinicalEntities(

  text:string

):ClinicalEntities{

  const input=text.toLowerCase();

  const result:ClinicalEntities={};


  //----------------------------------
  // Gestational age
  //----------------------------------

  const weekMatch=input.match(
    /(\d+)\s*(weeks|week|wks|wk)/
  );

  if(weekMatch){

    result.gestational_age=
      Number(weekMatch[1]);

  }


  //----------------------------------
  // Blood pressure
  //----------------------------------

  const bpMatch=input.match(
    /(\d{2,3})\s*\/\s*(\d{2,3})/
  );

  if(bpMatch){

    result.bp_systolic=
      Number(bpMatch[1]);

    result.bp_diastolic=
      Number(bpMatch[2]);

  }

  for (

const [entity,keywords]

of

Object.entries(CLINICAL_DICTIONARY)

){

const found =

keywords.some(

keyword=>

input.includes(keyword)

);

if(found){

(result as any)[entity]="yes";

}

}

  //----------------------------------
  // Symptoms
  //----------------------------------

  const bleedingRegex =
/\b(bleeding|spotting)\b/i;

if(bleedingRegex.test(input)){
    result.vaginal_bleeding="yes";
}

  if(
    ["abdominal pain","stomach pain","cramps","belly pain"]
    .some(w=>input.includes(w))
  ){

    result.severe_abdominal_pain="yes";

  }


  if(
    ["fever","temperature"]
    .some(w=>input.includes(w))
  ){

    result.fever="yes";

  }


  //----------------------------------
  // Pregnancy history
  //----------------------------------

  if(
    input.includes("first pregnancy")||
    input.includes("first baby")
  ){

    result.first_pregnancy="yes";

  }


  if(
    input.includes("twins")||
    input.includes("twin pregnancy")
  ){

    result.twins="yes";

  }


  if(
    input.includes("diabetes")||
    input.includes("gestational diabetes")
  ){

    result.diabetes="yes";

  }

  const reducedMovementPatterns = [

/baby.*not moving/i,

/baby.*moving less/i,

/baby.*moving much less/i,

/reduced fetal movement/i,

/reduced movement/i,

/less movement/i,

/decreased movement/i,

/not feeling.*baby/i

];

if(
reducedMovementPatterns.some(
pattern=>pattern.test(input)
)
){
result.reduced_fetal_movements="yes";
}

console.log(

"Clinical entities:",

result

);
  return result;

}