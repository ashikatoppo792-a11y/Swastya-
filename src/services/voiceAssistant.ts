/**
 * Voice Assistance & Audio Playback Service
 * Uses Web SpeechSynthesis API to read clinical guidance and medical term explanations
 * aloud in English, Hindi, and Indian regional voices.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, lang: string = 'en', onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || !text.trim()) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice language
  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (lang === 'or') {
    utterance.lang = 'hi-IN'; // Fallback to Indian accent if Odia voice is not in browser engine
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower, clearer speech for older users
  utterance.pitch = 1.0;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
