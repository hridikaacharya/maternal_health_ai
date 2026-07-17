import {

extractClinicalEntities

} from "@/lib/assistant/entityExtractor";


export function chatToScreeningInput(

message:string

){

return extractClinicalEntities(message);

}