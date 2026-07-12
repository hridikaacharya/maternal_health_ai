import { useTranslation } from 'react-i18next';
import type { ScreeningResult } from '@/lib/rule-engine/types';
import { educationModules } from '@/data/canonical/educationModules';
import { educationMapping } from '@/data/canonical/educationMapping';


export function EducationPlaceholder(
  { result }: { result: ScreeningResult | null }
) {

  const { t } = useTranslation();


const ruleModule = result?.primary?.education_module;

console.log("Education module:", ruleModule);
console.log("Available modules:", educationModules);

const moduleId =
  ruleModule ? educationMapping[ruleModule] : null;

const educationModule =
  educationModules.find(
    (item) => item.id === moduleId
  );

  return (
    <section className="panel education-panel">

      <div className="section-header compact">

        <span className="eyebrow">
          {t('sections.education')}
        </span>

        <h2>
          {educationModule?.title ?? "Education"}
        </h2>

      </div>


      {
        educationModule ? (

          <>
            <h3>Important information</h3>

            <ul>
              {educationModule.content.text.map((point)=>(
                <li key={point}>
                  {point}
                </li>
              ))}
            </ul>


            <h3>What you can do</h3>

            <ul>
              {educationModule.content.actions.map((action)=>(
                <li key={action}>
                  {action}
                </li>
              ))}
            </ul>

          </>

        ) : (

          <p>
            No education module available for this result.
          </p>

        )
      }

    </section>
  );
}