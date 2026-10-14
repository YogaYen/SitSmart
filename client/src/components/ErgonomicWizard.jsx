import React, { useState } from 'react';
import {
  Sparkles,
  Monitor,
  Armchair,
  Layers,
  SunMedium,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { submitAssessment } from '../services/api';

const STEPS = [
  {
    id: 'monitor',
    title: 'Monitor & Display Alignment',
    icon: Monitor,
    description: 'Ensure optimal visual alignment to prevent cervical spine compression and eye strain.',
    questions: [
      {
        id: 'monitorEyeLevel',
        label: 'Is the top third of your monitor directly at or slightly below your horizontal eye level?',
        options: [
          { value: 'yes', label: 'Yes, looking straight ahead reaches top third of screen' },
          { value: 'no_low', label: 'No, looking down (laptop on desk without riser)' },
          { value: 'no_high', label: 'No, looking upward (monitor mounted too high)' }
        ]
      },
      {
        id: 'monitorDistance',
        label: 'What is the approximate distance between your eyes and your screen?',
        options: [
          { value: 'arm_length', label: "Roughly arm's length (20 to 30 inches / 50-75 cm)" },
          { value: 'too_close', label: 'Closer than 20 inches (leaning in)' },
          { value: 'too_far', label: 'Further than 35 inches (squinting)' }
        ]
      }
    ]
  },
  {
    id: 'chair',
    title: 'Chair & Lumbar Support',
    icon: Armchair,
    description: 'Maintain natural lumbar lordosis curve and balanced pelvic weight distribution.',
    questions: [
      {
        id: 'chairLumbar',
        label: 'Does your chair have dedicated lumbar support filling the curve of your lower spine?',
        options: [
          { value: 'yes', label: 'Yes, built-in ergonomic cushion or lumbar roll' },
          { value: 'no', label: 'No, flat backrest or hollow gap behind lower back' }
        ]
      },
      {
        id: 'feetFlat',
        label: 'Are your feet resting completely flat on the floor with knees bent at 90°–100°?',
        options: [
          { value: 'yes', label: 'Yes, feet flat or resting on an ergonomic footrest' },
          { value: 'dangling', label: 'No, feet dangle or tuck backward under chair' },
          { value: 'crossed', label: 'No, frequently sitting cross-legged' }
        ]
      }
    ]
  },
  {
    id: 'desk',
    title: 'Desk & Armrest Ergonomics',
    icon: Layers,
    description: 'Neutral forearm, elbow, and wrist alignment to prevent Carpal Tunnel Syndrome.',
    questions: [
      {
        id: 'elbowAngle',
        label: 'Are your elbows bent at roughly 90° to 100° with wrists resting in a neutral position?',
        options: [
          { value: '90_degrees', label: 'Yes, shoulders relaxed, forearms parallel to desk' },
          { value: 'hunched_up', label: 'No, shoulders shrugged up because desk/chair is too low' },
          { value: 'reaching', label: 'No, reaching forward with elbows stretched out' }
        ]
      }
    ]
  },
  {
    id: 'lighting',
    title: 'Lighting & Visual Comfort',
    icon: SunMedium,
    description: 'Proper luminance and glare reduction to eliminate squinting and neck protrusion.',
    questions: [
      {
        id: 'screenGlare',
        label: 'Is there noticeable window or overhead glare reflecting off your monitor screen?',
        options: [
          { value: 'minimal', label: 'No, clean indirect lighting without reflections' },
          { value: 'high_glare', label: 'Yes, bright sunlight or harsh light glare on screen' }
        ]
      }
    ]
  }
];

export default function ErgonomicWizard({ onComplete, currentUser }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    monitorEyeLevel: 'yes',
    monitorDistance: 'arm_length',
    chairLumbar: 'yes',
    feetFlat: 'yes',
    elbowAngle: '90_degrees',
    screenGlare: 'minimal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleOptionSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const userId = currentUser ? (currentUser.userId || currentUser.id) : 'demo-user';
        const response = await submitAssessment(answers, userId);
        setResult(response.assessment || response);
        if (onComplete) onComplete(response.assessment || response);
      } catch (err) {
        console.warn("API offline, computing assessment locally:", err);
        // Fallback local assessment
        let score = 85;
        if (answers.monitorEyeLevel !== 'yes') score -= 15;
        if (answers.monitorDistance !== 'arm_length') score -= 10;
        if (answers.chairLumbar !== 'yes') score -= 15;
        if (answers.feetFlat !== 'yes') score -= 10;
        if (answers.elbowAngle !== '90_degrees') score -= 10;
        if (answers.screenGlare !== 'minimal') score -= 5;
        score = Math.max(25, Math.min(100, score));

        const fallbackResult = {
          score,
          riskLevel: score >= 80 ? "Low Risk (Compliant)" : score >= 65 ? "Moderate Strain Risk" : "High Musculoskeletal Risk",
          recommendations: [
            answers.monitorEyeLevel !== 'yes' ? "Elevate your monitor so eye level matches top 1/3 of screen." : "Maintain monitor eye level height.",
            answers.chairLumbar !== 'yes' ? "Place a lumbar roll or firm cushion in your lower back curve." : "Continue utilizing chair lumbar support.",
            answers.elbowAngle !== '90_degrees' ? "Adjust chair armrest height to support elbows at 90-100 degrees." : "Armrest elbow angle is optimal."
          ]
        };
        setResult(fallbackResult);
        if (onComplete) onComplete(fallbackResult);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];

  return (
    <div id="assessment-wizard" className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" /> Ergonomic Assessment Wizard
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Workstation Ergonomic Setup
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Step-by-step guidance to optimize your desk, chair, and monitor alignment.
            </p>
          </div>

          {/* Progress Pill */}
          {!result && (
            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <div className="w-36 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Step Body */}
        {!result ? (
          <div className="py-8 space-y-6">
            {/* Step Title & Icon */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <currentStepData.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {currentStepData.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Questions Form */}
            <div className="space-y-6 pt-2">
              {currentStepData.questions.map((q) => (
                <div key={q.id} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-200 block">
                    {q.label}
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, opt.value)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-brand-500/15 border-brand-500 text-white shadow-md shadow-brand-500/10 ring-1 ring-brand-500/30'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-750'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                              isSelected
                                ? 'border-brand-400 bg-brand-500 text-white'
                                : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Navigation Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-slate-750 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/25 transition-all active:scale-95"
              >
                {currentStep === STEPS.length - 1 ? (
                  isSubmitting ? "Computing Profile..." : "Complete Assessment"
                ) : (
                  <>
                    Next Step <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results Summary Screen */
          <div className="py-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-white mb-1">Assessment Complete!</h3>
            <p className="text-xs text-slate-400 mb-6">Here is your tailored workplace ergonomic profile.</p>

            {/* Score Metric Card */}
            <div className="max-w-md mx-auto bg-slate-950/60 rounded-2xl border border-slate-800 p-6 mb-6">
              <div className="flex items-center justify-center gap-6">
                <div>
                  <span className="text-5xl font-black text-emerald-400">{result?.score || 85}%</span>
                  <span className="text-[11px] block uppercase font-bold text-slate-400 mt-1">Ergonomic Rating</span>
                </div>
                <div className="h-12 w-px bg-slate-800" />
                <div className="text-left">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Classification:</span>
                  <p className="text-base font-bold text-white mt-0.5">{result?.riskLevel || "Low Risk"}</p>
                  <span className="text-[11px] text-emerald-400 font-medium">SDG 3 Compliant</span>
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="text-left max-w-xl mx-auto bg-slate-950/50 p-5 rounded-xl border border-slate-800 mb-6">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Tailored Action Plan for Your Desk:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {result?.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetWizard}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Test
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
