import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, X, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSubmitFeedback: (rating: 'helpful' | 'incorrect' | 'partially_accurate', comment: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState<'helpful' | 'incorrect' | 'partially_accurate'>('helpful');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback(rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold">AI Clinical Output Feedback</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Help improve the TriageAssist models across Indian facilities by rating the clinical accuracy and red-flag sensitivity for <strong>{patientName}</strong>.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRating('helpful')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                rating === 'helpful'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">Helpful & Accurate</span>
            </button>

            <button
              type="button"
              onClick={() => setRating('partially_accurate')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                rating === 'partially_accurate'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold">Partially Accurate</span>
            </button>

            <button
              type="button"
              onClick={() => setRating('incorrect')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                rating === 'incorrect'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ThumbsDown className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold">Incorrect / Over-triaged</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Specific Observation / Model Learning Notes
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Red-flag logic accurately caught early STEMI from lead II strip..."
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Submit Clinical Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
