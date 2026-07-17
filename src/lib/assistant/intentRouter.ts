export type Intent =
  | "education"
  | "screening"
  | "emergency"
  | "unknown";


export function detectIntent(message: string): Intent {

  const text = message.toLowerCase();


  if (
    text.includes("bleeding") ||
    text.includes("blood") ||
    text.includes("convulsion") ||
    text.includes("unconscious") ||
    text.includes("severe pain") ||
    text.includes("difficulty breathing")
  ) {
    return "emergency";
  }


  if (
    text.includes("pain") ||
    text.includes("headache") ||
    text.includes("fever") ||
    text.includes("vision")
  ) {
    return "screening";
  }


  if (
    text.includes("what") ||
    text.includes("how") ||
    text.includes("why")
  ) {
    return "education";
  }


  return "unknown";
}