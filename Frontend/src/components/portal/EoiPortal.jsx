import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Send, RefreshCw, AlertCircle } from 'lucide-react';

import EoiHeader from './EoiHeader';
import EoiStepper from './EoiStepper';
import Step1Profile from './Step01Profile';
import Step2DairyExperience from './Step02DairyExperience';
import EoiSuccess from './EoiSuccess';
import {
  INITIAL_EOI_STATE,
  STEP_FIELDS,
  validateEoiStep,
  loadEoiDraft,
  saveEoiDraft,
  clearEoiDraft,
} from './Eoiform';

const API_URL = import.meta.env?.VITE_API_URL ?? (import.meta.env?.DEV ? 'http://localhost:5000' : '');
const TOTAL_STEPS = 2;

export default function EoiPortal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [formData, setFormData] = useState(() => loadEoiDraft());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionRecord, setSubmissionRecord] = useState(null);

  const topRef = useRef(null);

  useEffect(() => {
    if (!submissionRecord) saveEoiDraft(formData);
  }, [formData, submissionRecord]);

  const scrollTop = () =>
    topRef.current
      ? topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      : window.scrollTo({ top: 0, behavior: 'smooth' });

  const goNext = () => {
    const { isValid, errors: e } = validateEoiStep(currentStep, formData);
    if (!isValid) {
      setErrors(e);
      scrollTop();
      return;
    }
    setErrors({});
    const next = Math.min(currentStep + 1, TOTAL_STEPS);
    setCurrentStep(next);
    setMaxStepReached((m) => Math.max(m, next));
    scrollTop();
  };

  const goPrev = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(1, s - 1));
    scrollTop();
  };

  const goToStep = (target) => {
    if (target < currentStep) {
      setErrors({});
      setCurrentStep(target);
    } else if (target > currentStep) {
      const { isValid, errors: e } = validateEoiStep(currentStep, formData);
      if (!isValid) {
        setErrors(e);
      } else {
        setErrors({});
        setCurrentStep(target);
        setMaxStepReached((m) => Math.max(m, target));
      }
    }
    scrollTop();
  };

  const clearDraft = () => {
    if (window.confirm('Reset all fields and clear your saved draft?')) {
      clearEoiDraft();
      setFormData({ ...INITIAL_EOI_STATE });
      setCurrentStep(1);
      setMaxStepReached(1);
      setErrors({});
      scrollTop();
    }
  };

  const submit = async () => {
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const { isValid, errors: e } = validateEoiStep(step, formData);
      if (!isValid) {
        setCurrentStep(step);
        setErrors(e);
        scrollTop();
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let sessionId = localStorage.getItem('dairy_yatra_session_id');
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem('dairy_yatra_session_id', sessionId);
      }

      const res = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, sessionId }),
      });

      let result = {};
      try {
        result = await res.json();
      } catch {
        /* non-JSON response */
      }

      if (!res.ok) {
        if (result?.errors && Object.keys(result.errors).length) {
          const firstKey = Object.keys(result.errors)[0];
          setCurrentStep(STEP_FIELDS[1].includes(firstKey) ? 1 : 2);
          setErrors(result.errors);
        } else {
          // EOI_NOT_OPEN, EOI_CLOSED, DUPLICATE, or generic failure
          setErrors({ submit: result?.message || result?.error || 'Submission failed. Please try again.' });
        }
        scrollTop();
        return;
      }

      clearEoiDraft();
      setSubmissionRecord(
        result?.submissionRecord || {
          refId: result?.applicationId || result?.refId || 'PENDING',
          formattedDate: new Date().toLocaleString('en-IN'),
          data: formData,
        }
      );
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      console.error('Submit error:', err);
      setErrors({ submit: 'Unable to reach the Dairy Yatra server. Please check your connection and try again.' });
      scrollTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F2EFE7] text-[#172738] overflow-y-auto min-h-screen flex flex-col font-sans">
      <EoiHeader
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onClose={onClose}
        isDraftSaved={!submissionRecord}
        showProgress={!submissionRecord}
      />

      {submissionRecord ? (
        <EoiSuccess submissionRecord={submissionRecord} onClose={onClose} />
      ) : (
        <div className="flex-1 flex flex-col">
          <EoiStepper currentStep={currentStep} maxStepReached={maxStepReached} onStepClick={goToStep} />

          <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div ref={topRef} />

            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">
                    {errors.submit
                      ? 'We could not submit your Expression of Interest:'
                      : 'Please correct the highlighted fields before continuing:'}
                  </h4>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {Object.values(errors).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C8DFDB] shadow-xl">
              {currentStep === 1 && <Step1Profile formData={formData} setFormData={setFormData} errors={errors} />}
              {currentStep === 2 && (
                <Step2DairyExperience
                  formData={formData}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  errors={errors}
                />
              )}

              <div className="pt-10 mt-10 border-t border-[#C8DFDB] flex flex-col sm:flex-row items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#F2EFE7] border border-[#C8DFDB] hover:bg-[#E5E1D5] w-full sm:w-auto active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#3368A0]" /> Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-xs text-[#4E657D] hover:text-rose-600 hover:bg-rose-50 w-full sm:w-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Clear Draft
                  </button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center justify-center gap-2 bg-[#3368A0] hover:bg-[#234974] text-white px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl active:scale-95 w-full sm:w-auto cursor-pointer"
                  >
                    Continue to Dairy Experience <ArrowRight className="w-4 h-4 text-[#C8DFDB]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={submit}
                    className={`flex items-center justify-center gap-2.5 bg-[#3368A0] hover:bg-[#234974] text-white px-9 py-4 rounded-2xl font-bold text-base shadow-2xl w-full sm:w-auto ${
                      isSubmitting ? 'opacity-80 cursor-wait' : 'active:scale-95 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-[#C8DFDB]" /> Submitting...
                      </>
                    ) : (
                      <>
                        SUBMIT EXPRESSION OF INTEREST <Send className="w-5 h-5 text-[#C8DFDB]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}