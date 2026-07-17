import { detectIntent } from "./intentRouter";


export function assistantResponse(message: string) {

  const intent = detectIntent(message);


  switch(intent) {

    case "education":
      return {
        type: "education",
        message:
          "I can provide information about pregnancy care, nutrition, ANC visits, and warning signs."
      };


    case "screening":
      return {
        type: "screening",
        message:
          "I can help check your symptoms. Let me ask a few questions."
      };


    case "emergency":
      return {
        type: "emergency",
        message:
          "Some symptoms may require urgent medical attention. Let me help identify warning signs."
      };


    default:
      return {
        type: "unknown",
        message:
          "I can help with pregnancy health information and warning signs."
      };

  }

}