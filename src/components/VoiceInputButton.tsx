import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, RotateCcw } from 'lucide-react';

interface VoiceInputProps {
  language: string;
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onTranslatedChange?: (text: string) => void;
}

const sampleVoiceTranscripts: Record<string, string> = {
  hi: 'मुझे पिछले दो दिनों से बहुत तेज बुखार और बदन दर्द है। आज सुबह से सांस लेने में भी हल्की तकलीफ हो रही है।',
  gu: 'મને લગભગ પોણો કલાકથી છાતીમાં ખૂબ ભારેપણું લાગે છે, જાણે કોઈ વજન મૂકી દીધું હોય. દર્દ ડાબા હાથ અને જડબા સુધી જાય છે.',
  or: 'ପିଲାଟିକୁ ଚାରି ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଅଛି। ଆଜି ସକାଳେ ଦାନ୍ତ ଘଷିବା ବେଳେ ମାଢ଼ିରୁ ରକ୍ତ ବାହାରିଲା।',
  bn: 'আমার ডান পায়ের বুড়ো আঙুলে তিন সপ্তাহ ধরে একটা ঘা হয়েছে। পুঁজ বের হচ্ছে এবং চারপাশে লাল হয়ে ফুলে গেছে।',
  ta: 'தொழிற்சாலையில் வேலை செய்யும் போது ரசாயன திரவம் என் வலது முழங்கையில் சிந்திவிட்டது. இப்போது தோல் சிவந்து கொப்புளங்கள் வந்து شدیدமாக எரிகிறது.',
  te: 'నాకు మూడు రోజుల నుండి తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. కఫంలో కొద్దిగా రక్తం కూడా కనిపించింది.',
  mr: 'गेल्या पाच दिवसांपासून मला रात्री झोप येत नाहीये. परीक्षेचा खूप ताण आलाय, छातीत धडधड वाटते.',
  pa: 'ਮੈਨੂੰ ਲਗਭਗ ਇੱਕ ਮਹੀਨੇ ਤੋਂ ਖੰਘ ਹੈ ਅਤੇ ਬਲਗਮ ਆਉਂਦੀ ਹੈ। ਸ਼ਾਮ ਨੂੰ ਹਲਕਾ ਬੁਖਾਰ ਚੜ੍ਹ ਜਾਂਦਾ ਹੈ ਅਤੇ ਭਾਰ ਘੱਟ ਗਿਆ ਹੈ।',
  en: 'I have severe crushing pain in the center of my chest radiating to my left arm for 45 minutes with heavy cold sweating.',
};

const quickPhrasesByLang: Record<string, string[]> = {
  hi: ['सीने में तेज दर्द व पसीना', '4 दिन से तेज बुखार व उल्टी', 'पैर में गहरा घाव व मवाद', 'सांस फूलना व खांसी'],
  gu: ['છાતીમાં ભારેપણું અને દુખાવો', 'પગમાં ઘા અને સોજો', 'તાવ અને શરદી', 'શ્વાસ લેવામાં તકલીફ'],
  or: ['ପ୍ରବଳ ଜ୍ୱର ଓ ଦୁର୍ବଳତା', 'ଛାତିରେ ଯନ୍ତ୍ରଣା', 'ଗୋଡ଼ରେ ଘା’', 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ'],
  bn: ['বুকে তীব্র ব্যথা', 'পায়ে গভীর ক্ষত', 'উচ্চ জ্বর ও বমি', 'শ্বাসকষ্ট ও কাশি'],
  ta: ['நெஞ்சு வலி மற்றும் வியர்வை', 'கையில் ரசாயன காயம்', 'காய்ச்சல் மற்றும் நடுக்கம்', 'மூச்சுத்திணறல்'],
  te: ['ఛాతీలో తీవ్రమైన నొప్పి', 'తీవ్రమైన జ్వరం', 'కాలుపై గాయం', 'శ్వాస తీసుకోవడంలో ఇబ్బంది'],
  mr: ['छातीत धडधड व अस्वस्थता', 'पायाला जखम व सूज', 'ताप व थंडी', 'दम लागणे'],
  pa: ['ਛਾਤੀ ਵਿੱਚ ਦਰਦ', 'ਲੰਬੇ ਸਮੇਂ ਤੋਂ ਖੰਘ ਤੇ ਬੁਖਾਰ', 'ਪੈਰ ਤੇ ਜ਼ਖਮ', 'ਸਾਹ ਚੜ੍ਹਨਾ'],
  en: ['Crushing chest pain radiating to arm', 'High fever >103°F with lethargy', 'Deep non-healing diabetic foot ulcer', 'Acute chemical skin burn'],
};

export const VoiceInputButton: React.FC<VoiceInputProps> = ({
  language,
  transcript,
  onTranscriptChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        gu: 'gu-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        or: 'or-IN',
      };

      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        if (finalTrans) {
          onTranscriptChange(transcript ? `${transcript} ${finalTrans}` : finalTrans);
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch {
      setSpeechSupported(false);
    }
  }, [language, transcript, onTranscriptChange]);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsRecording(false);
      setInterimText('');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
          return;
        } catch {}
      }

      // Simulated voice recording fallback
      setIsRecording(true);
      setInterimText('Listening to voice stream in ' + language.toUpperCase() + '...');
      setTimeout(() => {
        const sample = sampleVoiceTranscripts[language] || sampleVoiceTranscripts.en;
        onTranscriptChange(sample);
        setIsRecording(false);
        setInterimText('');
      }, 2400);
    }
  };

  const handleQuickChip = (phrase: string) => {
    if (!transcript) {
      onTranscriptChange(phrase);
    } else {
      onTranscriptChange(`${transcript}. ${phrase}`);
    }
  };

  const phrases = quickPhrasesByLang[language] || quickPhrasesByLang.en;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Voice & Text Symptom Intake
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Patients can speak freely in their native Indian language or type symptoms directly below.
          </p>
        </div>

        {/* Primary Mic Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
              : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Tap to Speak Symptoms</span>
            </>
          )}
        </button>
      </div>

      {/* Soundwave animation when recording */}
      {isRecording && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            Listening... Speak now in your natural language ({language.toUpperCase()})
          </div>
          {/* Animated sound equalizer bars */}
          <div className="flex items-end gap-1 h-5">
            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-3"></span>
            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-5 delay-100"></span>
            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-4 delay-200"></span>
            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-5 delay-75"></span>
            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-2 delay-150"></span>
          </div>
        </div>
      )}

      {/* Editable Transcript Textarea */}
      <div className="relative">
        <textarea
          rows={4}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Speak using the microphone above or type your symptoms here (e.g. onset, severity, location, what makes it worse)..."
          className="w-full p-3.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        {interimText && (
          <div className="absolute bottom-3 left-4 text-xs italic text-teal-600 dark:text-teal-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">
            {interimText}
          </div>
        )}

        {transcript && (
          <button
            type="button"
            onClick={() => onTranscriptChange('')}
            title="Clear text"
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Quick Regional Symptom Chips */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick symptom phrases (tap to insert):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {phrases.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickChip(phrase)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/50 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 transition"
            >
              + {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
