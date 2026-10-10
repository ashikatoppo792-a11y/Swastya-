/**
 * Web Audio API based alarm sound generator.
 * Provides authentic, pleasant, and audible alert sounds without requiring external audio files.
 */

let activeAudioCtx: AudioContext | null = null;
let activeAlarmOscillators: OscillatorNode[] = [];
let alarmTimeoutId: number | null = null;

function getAudioContext(): AudioContext {
  if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    activeAudioCtx = new AudioContextClass();
  }
  if (activeAudioCtx.state === 'suspended') {
    activeAudioCtx.resume();
  }
  return activeAudioCtx;
}

/**
 * Stop any currently ringing alarm sound immediately.
 */
export function stopAlarmSound(): void {
  if (alarmTimeoutId) {
    clearTimeout(alarmTimeoutId);
    alarmTimeoutId = null;
  }
  activeAlarmOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {}
  });
  activeAlarmOscillators = [];
}

/**
 * Play a bright, rhythmic, audible medical reminder alarm chime.
 * Plays 3 harmonious chime pulses (F#5, A#5, C#6) twice, mimicking a modern medical pager/reminder alarm.
 */
export function playReminderAlarmSound(repeatCount = 2, onFinished?: () => void): void {
  try {
    stopAlarmSound();
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Chime notes: F#5 (740Hz), A#5 (932Hz), C#6 (1108Hz), F#6 (1480Hz)
    const chords = [
      { freq: 740, delay: 0.00, dur: 0.18 },
      { freq: 932, delay: 0.16, dur: 0.18 },
      { freq: 1108, delay: 0.32, dur: 0.35 },
      { freq: 1480, delay: 0.48, dur: 0.55 },
    ];

    const cycleDuration = 1.1; // seconds per cycle

    for (let c = 0; c < repeatCount; c++) {
      const cycleStart = now + c * cycleDuration;

      chords.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Use sine + harmonic for rich, bell-like timbre
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, cycleStart + note.delay);

        // Envelope: swift attack, smooth musical decay
        gain.gain.setValueAtTime(0.0001, cycleStart + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.35, cycleStart + note.delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, cycleStart + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(cycleStart + note.delay);
        osc.stop(cycleStart + note.delay + note.dur + 0.05);

        activeAlarmOscillators.push(osc);
      });
    }

    const totalDurationMs = repeatCount * cycleDuration * 1000;
    alarmTimeoutId = window.setTimeout(() => {
      stopAlarmSound();
      if (onFinished) onFinished();
    }, totalDurationMs);
  } catch (err) {
    console.warn('Unable to play reminder alarm audio:', err);
  }
}

/**
 * Play an urgent double-beep emergency alert sound.
 */
export function playEmergencyAlarmSound(): void {
  try {
    stopAlarmSound();
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const beeps = [0, 0.2, 0.5, 0.7];
    beeps.forEach((startOffset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now + startOffset); // A5

      gain.gain.setValueAtTime(0.0001, now + startOffset);
      gain.gain.linearRampToValueAtTime(0.4, now + startOffset + 0.02);
      gain.gain.linearRampToValueAtTime(0.0001, now + startOffset + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startOffset);
      osc.stop(now + startOffset + 0.16);

      activeAlarmOscillators.push(osc);
    });
  } catch (err) {
    console.warn('Unable to play emergency alarm sound:', err);
  }
}
