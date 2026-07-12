import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { isWeeksValid } from '../../services/clinicalEngine';

export default function Step1Profile({ formData, updateField, onNext }) {
  const weeks = Number(formData.weeksPregnant) || 0;
  const clampWeeks = (val) => Math.min(42, Math.max(1, val));

  return (
    <div className="step">
      <h2 className="step-title">Let's start with the basics</h2>
      <p className="step-hint">This takes about a minute. You can go back and change anything.</p>

      <div className="field">
        <label className="field-label">How many weeks pregnant?</label>
        <div className="stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={() => updateField({ weeksPregnant: clampWeeks(weeks - 1) })}
            aria-label="Decrease weeks"
          >
            <Minus size={18} />
          </button>
          <div className="stepper-value">
            <span className="stepper-number">{weeks}</span>
            <span className="stepper-unit">weeks</span>
          </div>
          <button
            type="button"
            className="stepper-btn"
            onClick={() => updateField({ weeksPregnant: clampWeeks(weeks + 1) })}
            aria-label="Increase weeks"
          >
            <Plus size={18} />
          </button>
        </div>
        <input
          type="range"
          min="1"
          max="42"
          value={weeks}
          onChange={(e) => updateField({ weeksPregnant: clampWeeks(Number(e.target.value)) })}
          className="range-slider"
          aria-label="Weeks pregnant slider"
        />
      </div>

      <div className="field">
        <label className="field-label">Is this your first pregnancy?</label>
        <div className="pill-group">
          {['yes', 'no'].map((val) => (
            <button
              key={val}
              type="button"
              className={`pill-btn ${formData.isFirstPregnancy === val ? 'is-active' : ''}`}
              onClick={() => updateField({ isFirstPregnancy: val })}
            >
              {val === 'yes' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Age</label>
        <input
          type="number"
          inputMode="numeric"
          placeholder="e.g. 24"
          value={formData.age}
          onChange={(e) => updateField({ age: e.target.value })}
          className="text-input"
        />
      </div>

      <div className="field">
        <label className="field-label">
          Blood pressure <span className="field-optional">(optional)</span>
        </label>
        <div className="bp-row">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Systolic"
            value={formData.bloodPressureSys}
            onChange={(e) => updateField({ bloodPressureSys: e.target.value })}
            className="text-input"
          />
          <span className="bp-separator">/</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Diastolic"
            value={formData.bloodPressureDia}
            onChange={(e) => updateField({ bloodPressureDia: e.target.value })}
            className="text-input"
          />
        </div>
        <p className="field-note">Don't have this on hand? Skip it — we'll flag it for your next visit.</p>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!isWeeksValid(formData.weeksPregnant)}
        onClick={onNext}
      >
        Continue to Symptoms
      </button>
    </div>
  );
}
