import React from 'react';

const STEPS = ['Profile', 'Symptoms', 'History'];

export default function ProgressSteps({ current }) {
  return (
    <ol className="terrace-steps">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum < current ? 'is-done' : stepNum === current ? 'is-active' : 'is-upcoming';
        return (
          <li key={label} className={`terrace-step terrace-step-${stepNum} ${state}`}>
            <span className="terrace-bar" />
            <span className="terrace-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
