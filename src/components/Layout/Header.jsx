import React from 'react';

export default function Header({ currentView, onChangeView, alertCount }) {
  return (
    <header className="header">
      <button type="button" className="header-brand" onClick={() => onChangeView('home')} aria-label="Go to home page">
        <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M2 30 L14 12 L20 21 L26 10 L38 30 Z" fill="var(--color-brand)" />
          <circle cx="26.5" cy="9" r="3.4" fill="var(--color-accent)" />
        </svg>
        <div>
          <p className="header-title">Sathi</p>
          <p className="header-subtitle">Maternal Health Companion · MHDSS</p>
        </div>
      </button>

      <div className="view-toggle" role="tablist" aria-label="Choose view">
        <button
          type="button"
          role="tab"
          aria-selected={currentView === 'home'}
          className={`view-toggle-btn ${currentView === 'home' ? 'is-active' : ''}`}
          onClick={() => onChangeView('home')}
        >
          Home
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={currentView === 'patient'}
          className={`view-toggle-btn ${currentView === 'patient' ? 'is-active' : ''}`}
          onClick={() => onChangeView('patient')}
        >
          Patient Assessment
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={currentView === 'fchv'}
          className={`view-toggle-btn ${currentView === 'fchv' ? 'is-active' : ''}`}
          onClick={() => onChangeView('fchv')}
        >
          FCHV Dashboard
          {alertCount > 0 && <span className="view-toggle-badge">{alertCount}</span>}
        </button>
      </div>
    </header>
  );
}
