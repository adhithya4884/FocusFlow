// src/utils/audioEngine.js
// Procedural Web Audio API sound generator - 100% offline, zero external audio asset dependencies!

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
    this.rainInterval = null;
  }

  // Lazy initialize AudioContext on user interaction to comply with browser autoplay policies
  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays session completion chime
   * @param {string} soundType - 'zen', 'digital', 'gong', 'marimba'
   * @param {number} volume - 0.0 to 1.0
   */
  playChime(soundType = 'zen', volume = 0.7) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (soundType) {
      case 'digital': {
        // Melodic 3-note ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const start = now + idx * 0.12;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          noteGain.gain.setValueAtTime(0, start);
          noteGain.gain.linearRampToValueAtTime(0.3, start + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(start);
          osc.stop(start + 0.85);
        });
        break;
      }

      case 'gong': {
        // Resonant deep gong
        const baseFreq = 160;
        [1, 1.48, 2.05, 2.76].forEach((multiplier, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(baseFreq * multiplier, now);

          const decay = 2.8 - idx * 0.4;
          noteGain.gain.setValueAtTime(0.35 / (idx + 1), now);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }

      case 'marimba': {
        // Warm wooden chord (F4, A4, C5)
        [349.23, 440.00, 523.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const start = now + idx * 0.04;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          noteGain.gain.setValueAtTime(0.4, start);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(start);
          osc.stop(start + 0.95);
        });
        break;
      }

      case 'zen':
      default: {
        // Singing bowl harmonic chime (E5 harmonic series with gentle beating shimmer)
        const fundamental = 659.25;
        const harmonics = [1, 2.01, 3.015, 4.02];

        harmonics.forEach((h, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * h, now);

          const amp = 0.35 / Math.pow(1.5, idx);
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(amp, now + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 3.3);
        });
        break;
      }
    }
  }

  /**
   * Plays a subtle mechanical tick
   */
  playTick(volume = 0.15) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Starts ambient sound generator
   * @param {string} soundType - 'rain', 'brown', 'white', 'binaural'
   * @param {number} volume - 0.0 to 1.0
   */
  startAmbient(soundType = 'rain', volume = 0.5) {
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.currentAmbientType = soundType;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(volume * 0.6, ctx.currentTime + 1.2);
    this.ambientGain.connect(ctx.destination);

    if (soundType === 'binaural') {
      // 40Hz Gamma Focus Binaural Beats (210Hz Left, 250Hz Right)
      const merger = ctx.createChannelMerger(2);

      const oscLeft = ctx.createOscillator();
      const oscRight = ctx.createOscillator();

      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(210, ctx.currentTime);

      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(250, ctx.currentTime);

      oscLeft.connect(merger, 0, 0); // left channel
      oscRight.connect(merger, 0, 1); // right channel

      merger.connect(this.ambientGain);

      oscLeft.start();
      oscRight.start();

      this.ambientSource = {
        stop: () => {
          try {
            oscLeft.stop();
            oscRight.stop();
          } catch {
            // Already stopped
          }
        }
      };
      return;
    }

    // Procedural noise buffer (Brown, White, or Rain)
    const bufferSize = ctx.sampleRate * 2; // 2-second looped noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (soundType === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (soundType === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    } else {
      // 'rain' = Pink noise + soft bandpass filter
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to shape the frequency response
    const filter = ctx.createBiquadFilter();
    if (soundType === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
    } else if (soundType === 'white') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
    } else {
      // Rain filter: high-cut + mid boost
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    }

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    whiteNoise.start();

    this.ambientSource = whiteNoise;
  }

  /**
   * Adjusts volume of running ambient sound
   */
  setAmbientVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        Math.max(0.001, volume * 0.6),
        this.ctx.currentTime
      );
    }
  }

  /**
   * Stops currently playing ambient sound
   */
  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        if (this.ambientSource) {
          try {
            this.ambientSource.stop();
          } catch {
            // Already stopped
          }
          this.ambientSource = null;
        }
      }, 450);
    }
    this.currentAmbientType = null;
  }
}

export const audioEngine = new AudioEngine();
