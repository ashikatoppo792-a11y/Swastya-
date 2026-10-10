import React, { useState } from 'react';
import { healthAwarenessTopics } from '../data/healthAwarenessData';
import { HealthAwarenessTopic } from '../types';
import { speakText, stopSpeaking, isSpeaking } from '../services/voiceAssistant';
import {
  HeartPulse,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter,
  Activity,
  Apple,
  Baby,
  Droplets,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

interface HealthAwarenessProps {
  currentLanguage: string;
  onStartIntakeWithTopic?: (topic: HealthAwarenessTopic) => void;
}

export const HealthAwarenessPage: React.FC<HealthAwarenessProps> = ({
  currentLanguage,
  onStartIntakeWithTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTopic, setActiveTopic] = useState<HealthAwarenessTopic | null>(null);
  const [isSpeakingTopic, setIsSpeakingTopic] = useState<string | null>(null);

  const categories = [
    'All',
    'Chronic Disease',
    'Maternal & Child',
    'Infectious / Vector',
    'Nutrition & Hygiene',
    'Preventive Care'
  ];

  const filteredTopics = healthAwarenessTopics.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      t.title.toLowerCase().includes(q) ||
      t.titleHi.includes(q) ||
      t.titleOr.includes(q) ||
      t.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleSpeak = (topic: HealthAwarenessTopic) => {
    if (isSpeakingTopic === topic.id) {
      stopSpeaking();
      setIsSpeakingTopic(null);
    } else {
      const text =
        currentLanguage === 'hi'
          ? topic.audioPromptText.hi
          : currentLanguage === 'or'
          ? topic.audioPromptText.or
          : topic.audioPromptText.en;

      speakText(text, currentLanguage, () => {
        setIsSpeakingTopic(null);
      });
      setIsSpeakingTopic(topic.id);
    }
  };

  const getTopicTitle = (topic: HealthAwarenessTopic) => {
    if (currentLanguage === 'hi') return topic.titleHi;
    if (currentLanguage === 'or') return topic.titleOr;
    return topic.title;
  };

  const getTopicSummary = (topic: HealthAwarenessTopic) => {
    if (currentLanguage === 'hi') return topic.summaryHi;
    if (currentLanguage === 'or') return topic.summaryOr;
    return topic.summary;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700">
          <HeartPulse className="w-4 h-4 text-teal-600" />
          <span>National Community Health Education & Disease Prevention</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Trustworthy Community Health & Preventive Care
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Guidance aligned with ICMR and National Health Mission protocols on Diabetes, Anemia, Dengue, Child Nutrition, and Hygiene for Indian families — with voice read-aloud support.
        </p>
      </div>

      {/* Search & Category Filter Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health topics (e.g. diabetes, dengue, anemia, fever, ORS, nutrition)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const isSpeakingThis = isSpeakingTopic === topic.id;

          return (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {topic.category}
                  </span>

                  {/* Audio Read Aloud Button */}
                  <button
                    type="button"
                    onClick={() => handleSpeak(topic)}
                    title="Listen to audio explanation"
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      isSpeakingThis
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-600'
                    }`}
                  >
                    {isSpeakingThis ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                  {getTopicTitle(topic)}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {getTopicSummary(topic)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Guide & Diet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onStartIntakeWithTopic && (
                  <button
                    type="button"
                    onClick={() => onStartIntakeWithTopic(topic)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold transition"
                  >
                    Check Symptoms
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Topic Modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-slide-up">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                  {activeTopic.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {getTopicTitle(activeTopic)}
                </h2>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setActiveTopic(null);
                }}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {getTopicSummary(activeTopic)}
            </p>

            {/* Key Signs & Prevention 2-col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Key Warning Signs
                </h4>
                <ul className="space-y-1.5 text-amber-900 dark:text-amber-200">
                  {activeTopic.keySigns.map((sign, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Prevention & Recommended Indian Diet
                </h4>
                <ul className="space-y-1.5 text-emerald-900 dark:text-emerald-200">
                  {activeTopic.preventionAndDiet.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* When to see doctor */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-200 space-y-1">
              <strong className="font-bold uppercase tracking-wider flex items-center gap-1 text-rose-700">
                <Stethoscope className="w-4 h-4" />
                When to See a Doctor Immediately:
              </strong>
              <p>{activeTopic.whenToSeeDoctor}</p>
            </div>

            {/* Myths vs Facts */}
            {activeTopic.mythsAndFacts && activeTopic.mythsAndFacts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  Common Indian Health Myths vs Medical Facts
                </h4>
                <div className="space-y-2 text-xs">
                  {activeTopic.mythsAndFacts.map((mf, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="text-rose-600 font-bold">{mf.myth}</div>
                      <div className="text-emerald-700 dark:text-emerald-300 font-medium">{mf.fact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
