import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Minimize2,
  Maximize2,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '../services/voiceAssistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    tab?: string;
    action?: string;
    isEmergency?: boolean;
    isHotline?: boolean;
  }[];
  isEmergency?: boolean;
}

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string, isEmergency?: boolean) => void;
  currentLanguage: string;
  onLanguageChange?: (lang: string) => void;
}

const DEFAULT_QUICK_CHIPS = [
  { label: 'Check fever & headache', query: 'I have high fever and severe headache for 2 days. What should I do?' },
  { label: 'Nearest 24x7 emergency', query: 'Where is the nearest 24x7 emergency hospital with ICU beds?' },
  { label: 'Explain CBC report', query: 'Can you explain my CBC blood test report and normal ranges?' },
  { label: 'Book OPD doctor', query: 'How do I book an online doctor appointment at a government hospital?' },
  { label: 'Dengue warning signs', query: 'What are the red-flag warning signs of dengue fever?' }
];

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  currentLanguage,
  onLanguageChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text:
          currentLanguage === 'hi'
            ? 'नमस्ते! मैं स्वास्थ सेतु AI स्वास्थ्य सहायक हूँ। मैं आपके लक्षणों के आधार पर प्राथमिक मार्गदर्शन, नजदीकी अस्पताल खोजने, मेडिकल रिपोर्ट समझाने या डॉक्टर अपॉइंटमेंट बुक करने में आपकी मदद कर सकता हूँ।\n\n⚠️ **महत्वपूर्ण सूचना:** मैं केवल निर्णय-सहायक हूँ। मैं कोई अंतिम निदान या दवा का पर्चा नहीं देता। आपातकाल में तुरंत **108** पर कॉल करें।'
            : currentLanguage === 'or'
            ? 'ନମସ୍କାର! ମୁଁ ସ୍ୱାସ୍ଥ୍ୟ ସେତୁ AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ ଲକ୍ଷଣ ଆଧାରରେ ପ୍ରାଥମିକ ପରାମର୍ଶ, ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଖୋଜିବା, କିମ୍ବା ଡାକ୍ତର ବୁକିଂ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି।\n\n⚠️ ଜରୁରୀକାଳୀନ ସ୍ଥିତିରେ ତୁରନ୍ତ **୧୦୮** କଲ୍ କରନ୍ତୁ।'
            : 'Hello! I am your SwasthyaSetu AI Health Assistant. I can help evaluate your symptoms, locate nearby emergency hospitals & PHCs, explain diagnostic lab reports, or assist with doctor bookings.\n\n⚠️ **Decision-Support Notice:** The AI never diagnoses or prescribes. In acute emergencies, please call 108 immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '✨ Check Symptoms', tab: 'symptom-checker' },
          { label: '🏥 Find Nearby Hospitals', tab: 'nearby-hospitals' },
          { label: '📅 Book Doctor OPD', tab: 'doctor-appointments' }
        ]
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentLanguage,
          history: messages.slice(-4)
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggestedActions,
          isEmergency: data.isEmergency
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Offline Local Fallback Responder
      const lower = text.toLowerCase();
      let fallbackReply = 'Thank you for reaching out. Based on your input, please consult an attending medical professional at your local Primary Health Centre (PHC).';
      let actions: NonNullable<ChatMessage['suggestedActions']> = [{ label: '✨ Check Symptoms', tab: 'symptom-checker' }];

      if (lower.includes('chest') || lower.includes('breath') || lower.includes('108')) {
        fallbackReply = '🚨 High acuity symptoms detected. If you are experiencing chest pain, severe breathlessness, or dizziness, call 108 Ambulance immediately or proceed to the nearest emergency center.';
        actions = [
          { label: '📞 Call 108 Ambulance', action: 'tel:108', isHotline: true },
          { label: '🧭 Nearest Emergency Care', tab: 'nearby-hospitals', isEmergency: true }
        ];
      } else if (lower.includes('hospital') || lower.includes('phc') || lower.includes('clinic')) {
        fallbackReply = 'You can browse all nearby government hospitals, community health centers (CHCs), and 24x7 pharmacies on our interactive map with real-time travel times.';
        actions = [{ label: '📍 Open Nearby Care Finder', tab: 'nearby-hospitals' }];
      } else if (lower.includes('doctor') || lower.includes('book') || lower.includes('opd')) {
        fallbackReply = 'You can book outpatient doctor consultation slots or eSanjeevani video teleconsultations directly in the portal.';
        actions = [{ label: '📅 Book Doctor Appointment', tab: 'doctor-appointments' }];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: actions
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (currentLanguage === 'hi') recognition.lang = 'hi-IN';
      else if (currentLanguage === 'or') recognition.lang = 'or-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      // Clean markdown tags for clear speech synthesis
      const cleanText = text.replace(/[*_#`]/g, '');
      speakText(cleanText, currentLanguage, () => setSpeakingMessageId(null));
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with your health query?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isExpanded
            ? 'w-full sm:w-[650px] h-[95vh] sm:h-[85vh]'
            : 'w-full sm:w-[460px] h-[85vh] sm:h-[620px]'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 text-white px-5 py-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-5 h-5 text-sky-200" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  SwasthyaSetu AI
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-white/20 text-sky-100 uppercase">
                  Triage Bot
                </span>
              </div>
              <p className="text-[11px] text-sky-200 flex items-center gap-1 leading-tight mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Multimodal Triage & Facility Guide</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clear button */}
            <button
              type="button"
              onClick={clearChat}
              title="Clear conversation"
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Standard view' : 'Expand view'}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition hidden sm:inline-flex"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              title="Close assistant"
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Disclaimer Ribbon */}
        <div className="bg-sky-50 dark:bg-sky-950/60 border-b border-sky-100 dark:border-sky-900/40 px-4 py-1.5 text-[11px] text-sky-800 dark:text-sky-300 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Non-prescriptive decision support • Call <strong>108</strong> for emergency</span>
          </span>
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">
            {currentLanguage.toUpperCase()}
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-2 shadow-sm ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : msg.isEmergency
                      ? 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-950 dark:text-red-100 rounded-bl-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {/* Message Text with newlines */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Suggested Action Buttons if provided */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200/50 dark:border-slate-800">
                      {msg.suggestedActions.map((action, idx) => {
                        if (action.action && action.action.startsWith('tel:')) {
                          return (
                            <a
                              key={idx}
                              href={action.action}
                              className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 no-underline"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>{action.label}</span>
                            </a>
                          );
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (action.tab) {
                                onNavigateTab(action.tab, action.isEmergency);
                                onClose();
                              }
                            }}
                            className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 font-bold text-[11px] transition flex items-center gap-1 shadow-xs"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 text-sky-500" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Message Bottom Controls */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-1">
                        {/* Audio Speak Button */}
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          title="Listen with voice assistance"
                          className="p-1 hover:text-sky-600 dark:hover:text-sky-400 transition"
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Copy text"
                          className="p-1 hover:text-sky-600 dark:hover:text-sky-400 transition"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 justify-start animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-xs p-3.5 shadow-sm flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium">Synthesizing clinical response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
          {DEFAULT_QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip.query)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap transition cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Microphone */}
            <button
              type="button"
              onClick={handleSpeechInput}
              title={isListening ? 'Listening...' : 'Voice Input (बोलकर पूछें)'}
              className={`p-2.5 rounded-xl transition ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Query Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask symptoms, hospital search, or medical guidance..."
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition disabled:opacity-40 cursor-pointer shadow-md shadow-sky-600/20"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
