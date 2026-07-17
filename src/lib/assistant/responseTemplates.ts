export type AssistantIntent =
  | "education"
  | "screening"
  | "emergency"
  | "unknown";


export function detectIntent(message: string): AssistantIntent {

  const text = message.toLowerCase();


  const emergencyWords = [
    "bleeding",
    "unconscious",
    "convulsion",
    "seizure",
    "can't breathe",
    "cannot breathe",
    "severe pain"
  ];


  for (const word of emergencyWords) {
    if (text.includes(word)) {
      return "emergency";
    }
  }


  const symptomWords = [
    "pain",
    "fever",
    "headache",
    "swelling",
    "dizzy",
    "vomit",
    "blood pressure",
    "pressure"
  ];


  for (const word of symptomWords) {
    if (text.includes(word)) {
      return "screening";
    }
  }


  const educationWords = [
    "what",
    "why",
    "how",
    "explain",
    "tell me",
    "should i",
    "can i"
  ];


  for (const word of educationWords) {
    if (text.includes(word)) {
      return "education";
    }
  }


  return "unknown";
}