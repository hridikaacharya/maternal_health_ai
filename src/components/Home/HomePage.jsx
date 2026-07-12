import React from 'react';
import { ArrowRight, ClipboardList, Split, Languages as LangIcon } from 'lucide-react';

function HeroIllustration() {
  return (
    <svg viewBox="0 0 640 380" className="hero-illustration" role="img" aria-label="Illustration of a winding path climbing terraced hills from a village to a health post">
      {/* sun */}
      <circle cx="560" cy="72" r="46" fill="var(--color-accent)" opacity="0.14" />
      <circle cx="560" cy="72" r="24" fill="var(--color-accent)" opacity="0.85" />

      {/* prayer flags */}
      <path d="M30,46 Q320,10 610,50" fill="none" stroke="var(--color-ink-faint)" strokeWidth="1.5" opacity="0.5" />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const x = 30 + t * 580;
        const y = 46 + Math.sin(t * Math.PI) * -18 + 18;
        const colors = ['var(--color-brand)', 'var(--color-accent)', 'var(--color-low)', 'var(--color-ink-soft)'];
        return <path key={i} d={`M${x - 8},${y} L${x + 8},${y} L${x},${y + 16} Z`} fill={colors[i % colors.length]} opacity="0.85" />;
      })}

      {/* back ridge */}
      <path
        d="M0,210 L70,160 L140,195 L210,130 L290,180 L370,110 L450,165 L520,120 L600,175 L640,150 L640,380 L0,380 Z"
        fill="var(--color-border-soft)"
      />

      {/* middle terraces */}
      <path
        d="M0,380 L0,270 L70,270 L70,245 L150,245 L150,220 L235,220 L235,250 L320,250 L320,225 L410,225 L410,255 L500,255 L500,230 L590,230 L590,270 L640,270 L640,380 Z"
        fill="var(--color-brand-soft)"
      />

      {/* front terraces */}
      <path
        d="M0,380 L0,320 L55,320 L55,295 L115,295 L115,270 L175,270 L175,300 L235,300 L235,320 L300,320 L300,340 L0,340 Z"
        fill="var(--color-brand)"
        opacity="0.9"
      />

      {/* winding path */}
      <path
        d="M92,300 C150,260 130,220 190,200 C260,175 250,140 330,120 C410,100 420,175 480,150 C520,133 535,120 552,95"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeDasharray="1 10"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* waypoints */}
      {[
        { x: 130, y: 224, label: '1st tri' },
        { x: 290, y: 145, label: '2nd tri' },
        { x: 480, y: 150, label: '3rd tri' },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="6" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="2.5" />
          <text x={p.x} y={p.y + 22} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-ink-faint)">
            {p.label}
          </text>
        </g>
      ))}

      {/* hut */}
      <g>
        <rect x="70" y="300" width="34" height="24" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M64,300 L87,280 L110,300 Z" fill="var(--color-accent)" />
      </g>

      {/* health post */}
      <g>
        <rect x="536" y="70" width="40" height="30" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M556,58 v18 M547,67 h18" stroke="var(--color-emergency)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <>
      <section className="home-hero">
        <div>
          <span className="home-eyebrow">Decision support, not replacement</span>
          <h1>Every hour of delay costs lives. Sathi helps close that gap.</h1>
          <p className="lead">
            A bilingual triage companion for pregnant women and Female Community Health Volunteers (FCHVs). A
            deterministic clinical engine decides the risk tier — never an AI model — and a translation layer explains
            it clearly, in English and Nepali, in seconds.
          </p>
          <div className="home-hero-ctas">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('patient')}>
              Start an assessment <ArrowRight size={16} />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('fchv')}>
              View FCHV dashboard
            </button>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="stats-strip">
        <div className="stat-card">
          <span className="stat-number">151</span>
          <span className="stat-label">maternal deaths per 100,000 live births in Nepal, per the 2021 national census-based Maternal Mortality Study</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">46.7%</span>
          <span className="stat-label">of Nepal's districts report a maternal mortality ratio at or above 140 per 100,000</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">1st</span>
          <span className="stat-label">of the "three delays" behind most maternal deaths is simply recognizing danger signs in time — the gap Sathi targets first</span>
        </div>
        <p className="stats-source">Sources: Nepal Maternal Mortality Study (2021 census), HERD International district-level insights.</p>
      </section>

      <section className="how-it-works">
        <h2 className="section-heading">How Sathi works</h2>
        <p className="section-subheading">Three steps, built to run in the field on a basic phone.</p>
        <div className="how-grid">
          <div className="how-card">
            <span className="how-number">01</span>
            <ClipboardList size={20} style={{ color: 'var(--color-brand)', marginBottom: 10 }} />
            <h3>Answer a few questions</h3>
            <p>A short guided form — gestational age, symptoms, care history. Missing data never blocks a result.</p>
          </div>
          <div className="how-card">
            <span className="how-number">02</span>
            <Split size={20} style={{ color: 'var(--color-brand)', marginBottom: 10 }} />
            <h3>A fixed rule engine decides</h3>
            <p>Auditable, WHO-aligned logic returns Low Risk, Urgent, or Emergency — with the exact rule that fired.</p>
          </div>
          <div className="how-card">
            <span className="how-number">03</span>
            <LangIcon size={20} style={{ color: 'var(--color-brand)', marginBottom: 10 }} />
            <h3>Get a clear explanation</h3>
            <p>The result is translated into warm, plain-language English and Nepali. Urgent cases alert an FCHV automatically.</p>
          </div>
        </div>
      </section>

      <section className="hybrid-explainer">
        <h2 className="section-heading">Built on a hybrid model, on purpose</h2>
        <p className="section-subheading">This keeps a language model from ever making a clinical call.</p>
        <div className="hybrid-flow">
          <div className="hybrid-node">
            <span className="hybrid-node-label">Input</span>
            <p className="hybrid-node-title">Your answers</p>
          </div>
          <ArrowRight className="hybrid-arrow" size={20} />
          <div className="hybrid-node is-engine">
            <span className="hybrid-node-label">Deterministic</span>
            <p className="hybrid-node-title">Rule engine</p>
          </div>
          <ArrowRight className="hybrid-arrow" size={20} />
          <div className="hybrid-node is-ai">
            <span className="hybrid-node-label">Generative</span>
            <p className="hybrid-node-title">Bilingual explanation</p>
          </div>
        </div>
        <p className="hybrid-note">The model translates the decision. It never makes it, and it can't override it.</p>
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div className="cta-band">
          <h2>Ready to try it?</h2>
          <p>Run through the assessment yourself — it takes about a minute.</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('patient')}>
            Start an assessment <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </>
  );
}
