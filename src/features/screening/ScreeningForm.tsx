import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useScreeningStore } from '@/store/useScreeningStore';

const dangerSignFields = [
  'unconscious',
  'convulsions',
  'vaginal_bleeding',
  'severe_abdominal_pain',
  'severe_difficulty_breathing',
  'fever',
  'foul_smelling_discharge',
  'severe_headache',
  'blurred_vision',
  'water_broke',
  'reduced_fetal_movements',
  'suicidal_ideation'
] as const;

function fieldValue(value: string | number | boolean | null | undefined) {
  if (typeof value === 'boolean') {
    return '';
  }

  return value ?? '';
}

export function ScreeningForm({ language }: { language: string }) {
  const { t } = useTranslation();
  const draft = useScreeningStore((state) => state.draft);
  const result = useScreeningStore((state) => state.result);
  const saveStatus = useScreeningStore((state) => state.saveStatus);
  const saveError = useScreeningStore((state) => state.saveError);
  const setField = useScreeningStore((state) => state.setField);
  const resetDraft = useScreeningStore((state) => state.resetDraft);
  const submitScreening = useScreeningStore((state) => state.submitScreening);

  const vitals = useMemo(
    () => [
      { name: 'bp_systolic', label: t('fields.bpSystolic'), placeholder: t('placeholders.bpSystolic'), step: '1' },
      { name: 'bp_diastolic', label: t('fields.bpDiastolic'), placeholder: t('placeholders.bpDiastolic'), step: '1' },
      { name: 'weight', label: t('fields.weight'), placeholder: t('placeholders.weight'), step: '0.1' },
      { name: 'haemoglobin', label: t('fields.haemoglobin'), placeholder: t('placeholders.haemoglobin'), step: '0.1' },
      { name: 'maternal_age', label: t('fields.maternalAge'), placeholder: t('placeholders.maternalAge'), step: '1' },
      { name: 'gestational_age_weeks', label: t('fields.gestationalAge'), placeholder: t('placeholders.gestationalAge'), step: '1' },
      { name: 'anc_visits_completed', label: t('fields.ancVisitsCompleted'), placeholder: t('placeholders.ancVisitsCompleted'), step: '1' }
    ],
    [t]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitScreening(language);
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-header">
        <span className="eyebrow">{t('sections.screening')}</span>
        <h2>{t('sections.vitals')}</h2>
      </div>

      <div className="field-grid">
        {vitals.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              type="number"
              inputMode="decimal"
              step={field.step}
              placeholder={field.placeholder}
              value={fieldValue(draft[field.name])}
              onChange={(event) => setField(field.name, event.target.value === '' ? '' : Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <div className="section-header compact">
        <h2>{t('sections.anc')}</h2>
      </div>

      <div className="field-grid field-grid--two">
        <label className="field">
          <span>{t('fields.proteinuria')}</span>
          <select value={fieldValue(draft.proteinuria)} onChange={(event) => setField('proteinuria', event.target.value)}>
            <option value="">{t('proteinuriaOptions.none')}</option>
            <option value="+">{t('proteinuriaOptions.plus')}</option>
            <option value="++">{t('proteinuriaOptions.plusplus')}</option>
            <option value="+++">{t('proteinuriaOptions.plusplusplus')}</option>
          </select>
        </label>

        <label className="field">
          <span>{t('fields.validTtcvHistory')}</span>
          <select value={fieldValue(draft.valid_ttcv_history)} onChange={(event) => setField('valid_ttcv_history', event.target.value)}>
            <option value="">{t('ttcvOptions.unknown')}</option>
            <option value="yes">{t('ttcvOptions.yes')}</option>
            <option value="no">{t('ttcvOptions.no')}</option>
          </select>
        </label>
      </div>

      <div className="section-header compact">
        <h2>{t('sections.dangerSigns')}</h2>
      </div>

      <div className="checkbox-grid">
        {dangerSignFields.map((field) => (
          <label className="checkbox-row" key={field}>
            <input
              type="checkbox"
              checked={draft[field] === 'yes'}
              onChange={(event) => setField(field, event.target.checked ? 'yes' : '')}
            />
            <span>{t(`dangerSigns.${field}`)}</span>
          </label>
        ))}
      </div>

      <div className="actions-row">
        <button type="submit" className="primary-button">
          {t('actions.runScreening')}
        </button>
        <button type="button" className="secondary-button" onClick={resetDraft}>
          {t('actions.reset')}
        </button>
      </div>

      <p className={`status-line ${saveStatus}`}>
        {saveStatus === 'saving' && t('status.saving')}
        {saveStatus === 'saved' && t('status.saved')}
        {saveStatus === 'error' && t('status.error')}
        {saveStatus === 'idle' && t('status.ready')}
      </p>
      {saveError ? <p className="error-line">{saveError}</p> : null}

      {result ? (
        <p className="screening-summary">
          {result.primary ? `${result.primary.risk_level} · ${result.primary.recommendation}` : t('result.noneTitle')}
        </p>
      ) : null}
    </form>
  );
}
