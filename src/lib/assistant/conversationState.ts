export type ConversationStage =
  | "initial"
  | "collecting_details"
  | "result";


export interface ConversationState {
  stage: ConversationStage;
  collected: Record<string, unknown>;
}