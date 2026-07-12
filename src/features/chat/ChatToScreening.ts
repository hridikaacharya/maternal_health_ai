import { extractSymptoms } from "./symptomExtractor";


export function chatToScreeningInput(
  message:string
) {

  const symptoms = extractSymptoms(message);


  return {

    danger_signs: {
      ...symptoms
    }

  };

}