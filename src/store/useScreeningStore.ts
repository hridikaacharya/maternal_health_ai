import { create } from 'zustand';
import { generateLocalEducation } from "@/lib/ai/localEducation";
import { runScreening } from '@/lib/rule-engine/ruleEngine';
import type { ScreeningInput, ScreeningResult } from '@/lib/rule-engine/types';
import { saveScreeningRecord } from '@/lib/storage/db';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ScreeningStoreState {
  draft: ScreeningInput;
  result: ScreeningResult | null;
  education: string | null;
  saveStatus: SaveStatus;
  saveError: string | null;
  setField: (field: string, value: string | number | boolean | null | undefined) => void;
  resetDraft: () => void;
  submitScreening: (language: string) => Promise<ScreeningResult>;
}

const initialDraft: ScreeningInput = {};

function setDraftField(draft: ScreeningInput, field: string, value: string | number | boolean | null | undefined) {
  const nextDraft = { ...draft };

  if (value === undefined || value === null || value === '') {
    delete nextDraft[field];
    return nextDraft;
  }

  nextDraft[field] = value;
  return nextDraft;
}

export const useScreeningStore = create<ScreeningStoreState>((set, get) => ({
  draft: initialDraft,
  result: null,
  education: null,
  saveStatus: 'idle',
  saveError: null,
  setField: (field, value) => {
    set((state) => ({
      draft: setDraftField(state.draft, field, value)
    }));
  },
  resetDraft: () => {
    set({
      draft: initialDraft,
      result: null,
      education: null,
      saveStatus: 'idle',
      saveError: null
    });
},
  submitScreening: async (language) => {
    const result = runScreening(get().draft);
    let education = null;

  if (result.primary) {
  education = generateLocalEducation(
    result.primary
  );
  }
    set({
  result,
  education,
  saveStatus: "saving",
  saveError: null
  });

    try {
      await saveScreeningRecord({
        language,
        input: get().draft,
        result,
        primaryRiskLevel: result.primary?.risk_level ?? null
      });

      set({ saveStatus: 'saved', saveError: null });
      return result;
    } catch (error) {
      set({ saveStatus: 'error', saveError: error instanceof Error ? error.message : 'Save failed' });
      return result;
    }
  }
}));
