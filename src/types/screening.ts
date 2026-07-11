import type { ScreeningInput, ScreeningResult } from '@/lib/rule-engine/types';

export interface ScreeningRecord {
  id: string;
  createdAt: string;
  language: string;
  input: ScreeningInput;
  result: ScreeningResult;
  primaryRiskLevel: string | null;
}
