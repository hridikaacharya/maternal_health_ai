import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { EducationPanel } from '@/features/education/EducationPanel';
import { ReferralResult } from '@/features/referral/ReferralResult';
import { ScreeningForm } from '@/features/screening/ScreeningForm';
import { useScreeningStore } from '@/store/useScreeningStore';
import { ChatScreen } from '@/features/chat/ChatScreen';

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
          <ChatScreen />
          <EducationPanel result={result} />
        </div>
        <ReferralResult result={result} />
      </div>
    </main>
  );
}