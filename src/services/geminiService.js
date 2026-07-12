// src/services/geminiService.js
//
// Presentation / translation layer. This is the ONLY file in the app that
// talks to a generative model, and it never makes clinical decisions — it
// receives an already-decided, immutable result from clinicalEngine.js and
// its one job is to render that result as clear, warm, bilingual prose.
//
// Swap providers by flipping USE_PYTHON_BACKEND to true and pointing
// PYTHON_BACKEND_URL at your server. Nothing upstream of this file (the
// wizard, the dashboard, the clinical engine) needs to change either way —
// that's the point of keeping every model call behind one service boundary.

import { GoogleGenAI } from '@google/genai';

const USE_PYTHON_BACKEND = false;
const PYTHON_BACKEND_URL = 'http://localhost:8000/api/explain-triage';
const GEMINI_MODEL = 'gemini-2.5-flash';

function buildPrompt(formData, clinicalResult) {
  return `You are a maternal health communications assistant supporting community health workers and pregnant women in Nepal.

You are given a clinical triage result that has ALREADY been decided by a rule-based clinical engine. That decision is final. Do not change it, soften it, second-guess it, or add new medical advice. Your only job is to explain it clearly and kindly, in two languages.

Return your response in exactly this format, with no extra commentary:

ENGLISH EXPLANATION:
<2-4 warm, plain-language sentences explaining the situation and what to do next>

NEPALI EXPLANATION:
<the same explanation, naturally translated into Devanagari Nepali — not a literal word-for-word translation>

Clinical context (do not contradict this):
- Gestational age: ${formData.weeksPregnant} weeks
- Triage level: ${clinicalResult.riskLevel}
- Required action: ${clinicalResult.action}
- Clinical reason: ${clinicalResult.reason}`;
}

function parseBilingualResponse(rawText) {
  const englishMatch = rawText.match(/ENGLISH EXPLANATION:([\s\S]*?)(NEPALI EXPLANATION:|$)/i);
  const nepaliMatch = rawText.match(/NEPALI EXPLANATION:([\s\S]*)/i);
  return {
    english: englishMatch ? englishMatch[1].trim() : rawText.trim(),
    nepali: nepaliMatch ? nepaliMatch[1].trim() : '',
  };
}

/**
 * @param {object} formData
 * @param {{riskLevel: string, action: string, reason: string}} clinicalResult
 * @returns {Promise<{english: string, nepali: string}>}
 */
export async function generateBilingualExplanation(formData, clinicalResult) {
  const prompt = buildPrompt(formData, clinicalResult);

  if (USE_PYTHON_BACKEND) {
    const response = await fetch(PYTHON_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_data: formData,
        clinical_result: clinicalResult,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Python backend responded with status ${response.status}`);
    }

    const payload = await response.json();
    return parseBilingualResponse(payload.explanation_text);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to a .env.local file (see .env.example).');
  }

  const client = new GoogleGenAI({ apiKey });
  const result = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return parseBilingualResponse(result.text);
}
