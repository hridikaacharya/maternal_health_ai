import { useTranslation } from 'react-i18next';
import type { ScreeningResult } from '@/lib/rule-engine/types';
import { educationModules } from '@/data/canonical/educationModules';
import { educationMapping } from '@/data/canonical/educationMapping';
import { useState } from "react";
import { PregnancyStageSelector } from "./PregnancyStageSelector";
import { EducationCard } from "./EducationCard";

export function EducationPanel(
  { result }: { result: ScreeningResult | null }
) {

  const { t } = useTranslation();

  const [stage, setStage] = useState<
    "first" | "second" | "third" | "postpartum" | null
  >(null);


  const availableModules = stage
    ? educationModules.filter(
      (module)=>module.stages.includes(stage)
    )
  : [];
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

      {educationModule && (
  <>
    <h3>Recommended for you</h3>

    <EducationCard
      module={educationModule}
    />
  </>
)}
<PregnancyStageSelector
  onStageChange={setStage}
/>

{availableModules.map((module) => (
  <EducationCard
  key={module.id}
  module={module}
  />
))}
</div>
</section>
);
}
