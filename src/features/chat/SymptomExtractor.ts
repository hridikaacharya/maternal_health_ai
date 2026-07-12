export function extractSymptoms(text: string) {

  const input = text.toLowerCase();


  return {

    severe_headache:
      [
        "headache",
        "head pain",
        "migraine"
      ].some(word => input.includes(word))
        ? "yes"
        : undefined,


    blurred_vision:
      [
        "blur",
        "blurry",
        "vision problem",
        "cannot see"
      ].some(word => input.includes(word))
        ? "yes"
        : undefined,


    vaginal_bleeding:
      [
        "bleeding",
        "blood",
        "spotting"
      ].some(word => input.includes(word))
        ? "yes"
        : undefined,


    severe_abdominal_pain:
      [
        "abdominal pain",
        "stomach pain",
        "belly pain",
        "cramps"
      ].some(word => input.includes(word))
        ? "yes"
        : undefined,


    fever:
      [
        "fever",
        "temperature",
        "hot"
      ].some(word => input.includes(word))
        ? "yes"
        : undefined,


  };

}