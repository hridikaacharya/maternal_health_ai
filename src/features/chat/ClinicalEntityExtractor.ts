export function extractClinicalEntities(text: string) {

  const input = text.toLowerCase();


  const entities: Record<string, string | number> = {};


  // Gestational age
  const weeksMatch =
    input.match(/(\d+)\s*(week|weeks)/);

  if (weeksMatch) {
    entities.gestational_age =
      Number(weeksMatch[1]);
  }


  // Blood pressure
  const bpMatch =
    input.match(/(\d+)\s*(\/|over)\s*(\d+)/);


  if (bpMatch) {

    entities.bp_systolic =
      Number(bpMatch[1]);

    entities.bp_diastolic =
      Number(bpMatch[3]);

  }


  // Hemoglobin
  const hbMatch =
    input.match(
      /(?:hb|hemoglobin|haemoglobin)\s*(\d+(\.\d+)?)/
    );


  if (hbMatch) {

    entities.haemoglobin_level =
      Number(hbMatch[1]);

  }


  // Protein in urine
  if (
    input.includes("protein") &&
    input.includes("urine")
  ) {

    entities.protein_in_urine = "++";

  }


  return entities;

}