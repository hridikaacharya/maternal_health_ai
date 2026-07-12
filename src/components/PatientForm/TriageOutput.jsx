import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Siren, Languages, RotateCcw } from 'lucide-react';
import { riskToElevation } from '../../services/clinicalEngine';

const RISK_META = {
  'LOW RISK': { icon: ShieldCheck, className: 'risk-low', label: 'Low Risk' },
  URGENT: { icon: AlertTriangle, className: 'risk-urgent', label: 'Urgent' },
  EMERGENCY: { icon: Siren, className: 'risk-emergency', label: 'Emergency' },
};

export default function TriageOutput({ assessment, translation, isProcessing, error, onRestart }) {
  const [lang, setLang] = useState('en');
  if (!assessment) return null;

  const meta = RISK_META[assessment.riskLevel] || RISK_META['LOW RISK'];
  const Icon = meta.icon;
  const isEscalated = assessment.riskLevel !== 'LOW RISK';
  const elevation = riskToElevation(assessment.riskLevel);

  return (
    <div className="step">
      <div className={`result-banner ${meta.className}`}>
        <Icon size={30} />
        <div>
          <p className="result-level">{meta.label}</p>
          <p className="result-action">{assessment.action}</p>
        </div>
      </div>

      <div className="elevation-band">
        <div className="elevation-marker" style={{ left: `${elevation}%` }} />
      </div>
      <div className="elevation-labels">
        <span>Valley — safe</span>
        <span>Tree line — caution</span>
        <span>Summit — seek care now</span>
      </div>

      <div className="result-reason">
        <span className="result-reason-label">Why this result</span>
        <p style={{ margin: 0 }}>{assessment.reason}</p>
        <span className="result-rule-id">{assessment.ruleId}</span>
      </div>

      {isEscalated && (
        <div className="result-logged">✓ This assessment was automatically logged to the FCHV monitoring dashboard.</div>
      )}

      <div className="translation-panel">
        <div className="translation-header">
          <span>
            <Languages size={15} /> Explain this in plain language
          </span>
          {translation && (
            <div className="lang-toggle">
              <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>
                English
              </button>
              <button type="button" className={lang === 'ne' ? 'is-active' : ''} onClick={() => setLang('ne')}>
                नेपाली
              </button>
            </div>
          )}
        </div>

        {isProcessing && !translation && !error && (
          <div className="translation-loading">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span>Preparing a clear explanation…</span>
          </div>
        )}

        {error && <p className="translation-error">{error}</p>}

        {translation && (
          <p className={lang === 'ne' ? 'translation-text lang-ne' : 'translation-text'}>
            {lang === 'en'
              ? translation.english
              : translation.nepali || 'Nepali translation unavailable for this response — English shown instead.'}
          </p>
        )}
      </div>

      <button type="button" className="btn btn-ghost btn-block" onClick={onRestart}>
        <RotateCcw size={16} /> Start a new assessment
      </button>
    </div>
  );
}
