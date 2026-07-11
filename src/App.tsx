import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { EducationPlaceholder } from '@/features/education/EducationPlaceholder';
import { ReferralResult } from '@/features/referral/ReferralResult';
import { ScreeningForm } from '@/features/screening/ScreeningForm';
import { useScreeningStore } from '@/store/useScreeningStore';

export default function App() {
  const { t, i18n } = useTranslation();
  const result = useScreeningStore((state) => state.result);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <h1>{t('appTitle')}</h1>
          <p>{t('appSubtitle')}</p>
        </div>
        <div className="hero-badge">
          <span>{i18n.language === 'ne' ? 'नेपाली' : 'English'}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="layout">
        <div className="stack">
          <ScreeningForm language={i18n.language} />
          <EducationPlaceholder />
        </div>
        <ReferralResult result={result} />
      </div>
    </main>
  );
}