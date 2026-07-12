import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CONDITIONS = ['Diabetes', 'High blood pressure', 'Anemia', 'Heart condition'];
const ANC_OPTIONS = [
  { value: '0', label: '0 visits' },
  { value: '1', label: '1–3 visits' },
  { value: '4', label: '4+ visits' },
];
const IRON_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Not sure' },
];

export default function Step3History({ formData, updateField, toggleCondition, onBack, onSubmit, isProcessing }) {
  return (
    <div className="step">
      <h2 className="step-title">Care history</h2>
      <p className="step-hint">Last few questions.</p>

      <div className="field">
        <label className="field-label">Documented ANC visits so far</label>
        <div className="pill-group">
          {ANC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`pill-btn ${formData.ancVisits === opt.value ? 'is-active' : ''}`}
              onClick={() => updateField({ ancVisits: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">
          Existing conditions <span className="field-optional">(select any that apply)</span>
        </label>
        <div className="chip-group">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              className={`chip ${formData.conditions.includes(cond) ? 'is-active' : ''}`}
              onClick={() => toggleCondition(cond)}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Taking iron/folic acid supplements?</label>
        <div className="pill-group">
          {IRON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`pill-btn ${formData.tookIron === opt.value ? 'is-active' : ''}`}
              onClick={() => updateField({ tookIron: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft size={16} /> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={isProcessing}>
          {isProcessing ? 'Evaluating…' : 'Generate Assessment'}
        </button>
      </div>
    </div>
  );
}
