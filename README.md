# Maternal Health AI Platform — MVP scaffold

## What this is
A working scaffold: canonical data layer + deterministic rule engine + basic
screening UI. The rule engine is NOT an AI model — it's a transparent,
auditable JS function that evaluates structured clinical rules. This is a
deliberate safety choice: every recommendation can be traced back to a
specific rule, condition, and WHO/NDHS/MPDSR source citation.

## Folder structure
```
data/raw/          -- original CSVs + Structure.txt (source of truth, don't edit)
data/canonical/     -- normalized rules.json after variable-name reconciliation
scripts/normalize.js -- converts raw rules into canonical schema
src/ruleEngine.js   -- the deterministic decision engine
tests/engine.test.js -- example screening scenarios (emergency/moderate/low)
public/index.html   -- basic screening form UI (open directly in a browser)
```

## Why a canonical layer exists
The decision_rules.csv, referral_rules.csv, danger_signs.csv, and
risk_factors.csv were built somewhat independently and use different
variable names for the same clinical concept (e.g. "unconscious" vs
"unconsciousness", "water_broke" vs "leaking_fluid"). If the engine matched
on raw variable names, rules would silently fail to fire. `normalize.js`
maps everything to one canonical variable name before the engine ever sees
it. The mapping table is at the top of that file — review it with your
clinical reviewer before trusting engine output.

## Known clinical conflicts flagged (need your friend's input)
1. Hypertension threshold mismatch: decision_rules.csv treats ≥160/110 as
   Emergency; referral_rules.csv treats ≥140/90 as Urgent. Both are kept as
   SEPARATE tiers in the canonical schema (140/90 = Urgent, 160/110 =
   Emergency) — this is the standard clinical convention (mild vs severe
   hypertension), but confirm this resolution is correct.
2. Haemoglobin unit inconsistency: decision_rules.csv rule 10's upper bound
   (110) looks like g/L, inconsistent with rule 9's g/dL threshold (7).
   Currently normalized assuming g/dL throughout (<7 severe, 7-11 moderate,
   ≥11 normal) — confirm this against the actual source guideline page.

## How to run
1. `node scripts/normalize.js` — regenerates data/canonical/rules.json
2. `node tests/engine.test.js` — runs example scenarios, prints output
3. Open `public/index.html` in a browser — try the screening form manually

## Next steps (not built yet)
- Wire public/index.html to load canonical/rules.json dynamically (currently
  it inlines a copy for simplicity — keep them in sync until you build a
  proper build step)
- Add bilingual (Nepali) labels
- Add offline storage (IndexedDB) for FCHV use without connectivity
- Replace inline copy with a real bundler (Vite) once UI grows
