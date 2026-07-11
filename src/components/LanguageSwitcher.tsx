import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language !== 'ne';

  return (
    <div className="language-switcher" aria-label={t('language.label')}>
      <button
        type="button"
        className={isEnglish ? 'is-active' : ''}
        onClick={() => void i18n.changeLanguage('en')}
      >
        {t('language.english')}
      </button>
      <button
        type="button"
        className={!isEnglish ? 'is-active' : ''}
        onClick={() => void i18n.changeLanguage('ne')}
      >
        {t('language.nepali')}
      </button>
    </div>
  );
}
