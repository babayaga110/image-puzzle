class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init to avoid browser policies complaining before interaction
    if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            this.ctx = new AudioContext();
        }
    }
  }

  // Must be called on first user interaction
  init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.error("Audio resume failed", e));
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1, time = 0) {
    if (!this.ctx || this.isMuted) return;
    
    try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);
        
        // Envelope to prevent clicking
        gain.gain.setValueAtTime(0, this.ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + time);
        osc.stop(this.ctx.currentTime + time + duration);
    } catch (e) {
        console.warn("Audio play failed", e);
    }
  }

  playClick() {
    // High pitched interface blip
    this.playTone(1200, 'sine', 0.1, 0.05);
  }

  playSelect() {
    // Lower selection thud
    this.playTone(400, 'triangle', 0.15, 0.05);
  }

  playMove() {
    // Mechanical sliding sound (two tones)
    this.playTone(300, 'square', 0.1, 0.03);
    this.playTone(150, 'sawtooth', 0.1, 0.03, 0.05);
  }

  playShuffle() {
    if (!this.ctx) return;
    // Rapid fire random notes
    for(let i=0; i<8; i++) {
        this.playTone(200 + Math.random() * 400, 'square', 0.05, 0.02, i * 0.06);
    }
  }

  playStart() {
    // Sci-fi power up
    this.playTone(200, 'sine', 0.4, 0.1, 0);
    this.playTone(400, 'sine', 0.4, 0.1, 0.1);
    this.playTone(800, 'sine', 0.6, 0.1, 0.2);
  }

  playWin() {
    // Major chord arpeggio (C Major: C, E, G, C)
    const root = 523.25; // C5
    const third = 659.25; // E5
    const fifth = 783.99; // G5
    const octave = 1046.50; // C6
    
    const vol = 0.08;
    const duration = 1.5;

    this.playTone(root, 'triangle', duration, vol, 0);
    this.playTone(third, 'triangle', duration, vol, 0.15);
    this.playTone(fifth, 'triangle', duration, vol, 0.30);
    this.playTone(octave, 'sine', duration + 0.5, vol, 0.45);
  }
}

export const audio = new SoundSystem();