import { useTranslation } from 'react-i18next';

import type { ScreeningResult } from '@/lib/rule-engine/types';

export function ReferralResult({ result }: { result: ScreeningResult | null }) {
  const { t } = useTranslation();

  return (
    <section className="panel result-panel" aria-live="polite">
      <div className="section-header">
        <span className="eyebrow">{t('sections.referral')}</span>
        <h2>{result?.primary ? result.primary.risk_level : t('result.noneTitle')}</h2>
      </div>

      {!result?.primary ? (
        <>
          <p>{t('result.noneBody')}</p>
          <p className="muted">{t('result.noneBody')}</p>
        </>
      ) : (
        <div className={`result-card risk-${result.primary.risk_level.toLowerCase()}`}>
          <p className="result-recommendation">{result.primary.recommendation}</p>
          <dl className="result-list">
            <div>
              <dt>{t('result.rule')}</dt>
              <dd>
                {result.primary.rule_name} #{result.primary.rule_id}
              </dd>
            </div>
            <div>
              <dt>{t('result.facility')}</dt>
              <dd>{result.primary.facility_level}</dd>
            </div>
            <div>
              <dt>{t('result.why')}</dt>
              <dd>{result.primary.explanation}</dd>
            </div>
            <div>
              <dt>{t('result.source')}</dt>
              <dd>
                {result.primary.source.citations.join('; ')}
                <span className="source-pages"> p. {result.primary.source.pages.join('; ')}</span>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
