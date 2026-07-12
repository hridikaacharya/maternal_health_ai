import React, { useState } from 'react';
import ProgressSteps from './ProgressSteps';
import Step1Profile from './Step1Profile';
import Step2Symptoms from './Step2Symptoms';
import Step3History from './Step3History';
import TriageOutput from './TriageOutput';
import { evaluateClinicalRisk } from '../../services/clinicalEngine';
import { generateBilingualExplanation } from '../../services/geminiService';

const initialFormState = {
  age: '',
  weeksPregnant: 20,
  isFirstPregnancy: 'yes',
  bloodPressureSys: '',
  bloodPressureDia: '',
  symptoms: [],
  conditions: [],
  ancVisits: '0',
  tookIron: 'unknown',
};

export default function FormWizard({ onAlertTriggered }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [assessment, setAssessment] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState('');

  const updateField = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const toggleSymptom = (symptom) =>
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));

  const toggleCondition = (condition) =>
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));

  const runTriageFlow = async () => {
    setIsProcessing(true);
    setApiError('');
    setTranslation(null);

    const result = evaluateClinicalRisk(formData);
    setAssessment(result);

    if (result.riskLevel === 'EMERGENCY' || result.riskLevel === 'URGENT') {
      onAlertTriggered({
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        weeks: formData.weeksPregnant,
        riskLevel: result.riskLevel,
        symptoms: formData.symptoms.length ? formData.symptoms.join(', ') : 'No explicit signs reported',
        resolved: false,
      });
    }

    setStep(4);

    try {
      const explanation = await generateBilingualExplanation(formData, result);
      setTranslation(explanation);
    } catch (err) {
      console.error(err);
      setApiError(
        'The bilingual translation service could not be reached. The clinical result above is still accurate and unaffected.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const restart = () => {
    setFormData(initialFormState);
    setAssessment(null);
    setTranslation(null);
    setApiError('');
    setStep(1);
  };

  return (
    <div className="wizard-card">
      {step <= 3 && <ProgressSteps current={step} />}

      {step === 1 && <Step1Profile formData={formData} updateField={updateField} onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step2Symptoms
          formData={formData}
          toggleSymptom={toggleSymptom}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3History
          formData={formData}
          updateField={updateField}
          toggleCondition={toggleCondition}
          onBack={() => setStep(2)}
          onSubmit={runTriageFlow}
          isProcessing={isProcessing}
        />
      )}
      {step === 4 && (
        <TriageOutput
          assessment={assessment}
          translation={translation}
          isProcessing={isProcessing}
          error={apiError}
          onRestart={restart}
        />
      )}
    </div>
  );
}
