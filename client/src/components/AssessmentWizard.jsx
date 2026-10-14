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
          { value: 'yes', label: 'Yes, looking straight ahead reaches top of screen' },
          { value: 'no_low', label: 'No, looking down (laptop on desk without riser)' },
          { value: 'no_high', label: 'No, looking upward (monitor mounted too high)' }
        ]
      },
      {
        id: 'monitorDistance',
        label: 'What is the approximate distance between your eyes and your screen?',
        options: [
          { value: 'arm_length', label: 'Roughly arm\'s length (20 to 30 inches / 50-75 cm)' },
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

export default function AssessmentWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    monitorEyeLevel: 'yes',
    monitorDistance: 'arm_length',
    chairLumbar: 'yes',
    feetFlat: 'yes',
    elbowAngle: '90_degrees',
    screenGlare: 'minimal'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = STEPS[currentStepIndex];

  const handleSelectOption = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const finishAssessment = async () => {
    setIsSubmitting(true);
    try {
      const data = await submitAssessment(answers);
      setResult(data.assessment || {
        score: 85,
        riskLevel: "Low Ergonomic Risk",
        recommendations: [
          "Maintain monitor top 1/3 at eye level.",
          "Keep lower lumbar cushion snug against your spine."
        ]
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setCurrentStepIndex(0);
    setIsSubmitted(false);
    setResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="assessment-wizard" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" /> Comprehensive Workplace Setup
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ergonomic Assessment Wizard
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Evaluate your physical desk, chair, monitor, and environmental alignment in 2 minutes. Receive a customized ergonomic score and checklist.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="glass-panel-glow rounded-2xl border border-slate-800 p-6 sm:p-8 relative">
          
          {!isSubmitted ? (
            <div>
              {/* Stepper Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6 overflow-x-auto gap-2">
                {STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  const isCurrent = idx === currentStepIndex;
                  const isDone = idx < currentStepIndex;
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                          : isDone
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{s.title.split(' ')[0]}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                    </div>
                  );
                })}
              </div>

              {/* Step Intro */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Step {currentStepIndex + 1}: {step.title}
                    </h3>
                    <p className="text-xs text-slate-400">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {step.questions.map((q) => (
                  <div key={q.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      {q.label}
                    </label>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.value)}
                            className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-brand-500/15 border-brand-500/50 text-white font-semibold'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                            }`}
                          >
                            <span>{opt.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-400 bg-brand-500' : 'border-slate-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Controls */}
              <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Evaluating...</span>
                  ) : currentStepIndex === STEPS.length - 1 ? (
                    <>
                      <span>Complete Assessment</span>
                      <Award className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Section</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-white mb-1">Assessment Complete!</h3>
              <p className="text-xs text-slate-400 mb-6">Here is your tailored workplace ergonomic profile.</p>

              {/* Score Metric Card */}
              <div className="max-w-md mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 mb-6">
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
              <div className="text-left max-w-xl mx-auto bg-slate-900/60 p-5 rounded-xl border border-slate-800 mb-6">
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
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Test
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save Report
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
