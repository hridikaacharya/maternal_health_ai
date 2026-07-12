import React from 'react';
import { Droplet, Brain, EyeOff, Zap, Flame, Thermometer, ArrowLeft } from 'lucide-react';

const SYMPTOMS = [
  { key: 'Vaginal bleeding', icon: Droplet },
  { key: 'Severe headache', icon: Brain },
  { key: 'Blurred vision', icon: EyeOff },
  { key: 'Convulsions', icon: Zap },
  { key: 'Severe abdominal pain', icon: Flame },
  { key: 'Fever', icon: Thermometer },
];

export default function Step2Symptoms({ formData, toggleSymptom, onBack, onNext }) {
  return (
    <div className="step">
      <h2 className="step-title">Any symptoms right now?</h2>
      <p className="step-hint">Select everything that applies. It's okay to select nothing.</p>

      <div className="symptom-grid">
        {SYMPTOMS.map(({ key, icon: Icon }) => {
          const active = formData.symptoms.includes(key);
          return (
            <button
              key={key}
              type="button"
              className={`symptom-chip ${active ? 'is-active' : ''}`}
              onClick={() => toggleSymptom(key)}
              aria-pressed={active}
            >
              <Icon size={20} />
              <span>{key}</span>
            </button>
          );
        })}
      </div>

      <div className="step-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}
