import { maternalEducation } from "@/data/education/maternalEducation";


export function getEducationResponse(
  message:string
){

 const text =
   message.toLowerCase();


 if(
   text.includes("preeclampsia") ||
   text.includes("blood pressure")
 ){
   return maternalEducation.preeclampsia;
 }


 if(
   text.includes("bleeding")
 ){
   return maternalEducation.bleeding;
 }


 if(
   text.includes("anc") ||
   text.includes("checkup")
 ){
   return maternalEducation.anc;
 }


 return null;

}