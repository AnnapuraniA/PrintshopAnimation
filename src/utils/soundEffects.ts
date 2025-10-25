// Sound Effects Manager using Web Audio API
// Generates procedural sounds without needing audio files

class SoundEffectsManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Initialize on first user interaction (autoplay policy)
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // Master volume (30%)
        this.masterGain.connect(this.audioContext.destination);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }

  private ensureContext() {
    if (!this.audioContext) {
      this.initialize();
    }
    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Footstep sound - short, muted thud
  playFootstep() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Noise-based footstep
    const bufferSize = this.audioContext.sampleRate * 0.05;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(now);
    noise.stop(now + 0.05);
  }

  // Whoosh sound - for object movement
  playWhoosh() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const duration = 0.3;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Printing machine sound - mechanical whirring
  playPrinting(duration: number = 3) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Low frequency hum
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 120;
    
    // Mid frequency buzz
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 240;
    
    // LFO for variation
    const lfo = this.audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 5;
    
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 10;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc2.frequency);
    
    // Filters for realistic sound
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 800;
    
    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.value = 400;
    filter2.Q.value = 1;
    
    // Gain envelope
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    gain.gain.setValueAtTime(0.15, now + duration - 0.3);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    
    osc1.connect(filter1);
    osc2.connect(filter2);
    filter1.connect(gain);
    filter2.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    lfo.stop(now + duration);
  }

  // Success chime - pleasant bell sound
  playSuccess() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
    
    notes.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const gain = this.audioContext!.createGain();
      const startTime = now + (index * 0.1);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  // Mechanical click - for handoffs
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Ambient workshop hum (continuous)
  private ambientSource: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  playAmbient() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext || !this.masterGain || this.ambientSource) return;

    const now = this.audioContext.currentTime;
    
    this.ambientSource = this.audioContext.createOscillator();
    this.ambientSource.type = 'triangle';
    this.ambientSource.frequency.value = 80;
    
    this.ambientGain = this.audioContext.createGain();
    this.ambientGain.gain.setValueAtTime(0, now);
    this.ambientGain.gain.linearRampToValueAtTime(0.03, now + 2);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    this.ambientSource.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
    
    this.ambientSource.start(now);
  }

  stopAmbient() {
    if (this.ambientSource && this.ambientGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1);
      this.ambientSource.stop(now + 1);
      this.ambientSource = null;
      this.ambientGain = null;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

// Singleton instance
export const soundManager = new SoundEffectsManager();

