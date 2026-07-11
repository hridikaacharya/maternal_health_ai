import { useTranslation } from 'react-i18next';

export function EducationPlaceholder() {
  const { t } = useTranslation();

  return (
    <section className="panel education-panel">
      <div className="section-header compact">
        <span className="eyebrow">{t('sections.education')}</span>
        <h2>{t('education.title')}</h2>
      </div>
      <p>{t('education.body')}</p>
    </section>
  );
}
