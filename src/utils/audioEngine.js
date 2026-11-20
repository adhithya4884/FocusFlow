// src/utils/audioEngine.js
// Procedural Web Audio API sound generator - 100% offline, zero external audio asset dependencies!

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
    this.ambientTimers = []; // Track all interval/timeouts for ambient FX
  }

  // Lazy initialize AudioContext on user interaction
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
   * Helper to clear all scheduled ambient effect timers
   */
  clearAmbientTimers() {
    this.ambientTimers.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });
    this.ambientTimers = [];
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
        // Melodic 4-note ascending chime (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const start = now + idx * 0.11;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          noteGain.gain.setValueAtTime(0, start);
          noteGain.gain.linearRampToValueAtTime(0.35, start + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.75);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(start);
          osc.stop(start + 0.8);
        });
        break;
      }

      case 'gong': {
        // Resonant deep temple gong
        const baseFreq = 145;
        [1, 1.48, 2.05, 2.76, 3.8].forEach((multiplier, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(baseFreq * multiplier, now);

          const decay = 3.5 - idx * 0.5;
          noteGain.gain.setValueAtTime(0.4 / (idx + 1), now);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }

      case 'marimba': {
        // Warm wooden chord (F4, A4, C5, E5)
        [349.23, 440.00, 523.25, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const start = now + idx * 0.05;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          noteGain.gain.setValueAtTime(0.45, start);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(start);
          osc.stop(start + 0.9);
        });
        break;
      }

      case 'zen':
      default: {
        // Singing bowl harmonic chime with gentle shimmer
        const fundamental = 587.33; // D5
        const harmonics = [1, 2.01, 3.02, 4.04];

        harmonics.forEach((h, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * h, now);

          const amp = 0.4 / Math.pow(1.6, idx);
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(amp, now + 0.06);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 3.5);
        });
        break;
      }
    }
  }

  /**
   * Procedural Soundscapes:
   * 1. 'rain' - Soft continuous rain wash + random distinct droplet plinks + distant rolling thunder
   * 2. 'forest' - Gentle breeze noise + realistic procedural bird chirps
   * 3. 'cafe' - Warm coffee shop atmosphere + occasional ceramic cup clinks
   * 4. 'binaural' - 40Hz Gamma Focus Beats with warm ambient fifth drone
   * 5. 'brown' - Deep low-frequency cosmic rumble with breathing wave filter
   */
  startAmbient(soundType = 'rain', volume = 0.5) {
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.currentAmbientType = soundType;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + 0.8);
    this.ambientGain.connect(ctx.destination);

    // Track all nodes created for ambient to stop later
    const activeNodes = [];

    // Helper: Generate looped noise buffer
    const createNoiseBuffer = (type = 'pink') => {
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'brown') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 4.5;
        }
      } else if (type === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.12;
          b6 = white * 0.115926;
        }
      } else {
        // white
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }
      }
      return buffer;
    };

    if (soundType === 'rain') {
      // 1. BASE RAIN NOISE (Gentle steady patter)
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = createNoiseBuffer('pink');
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1100, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.5, ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.ambientGain);
      rainSource.start();
      activeNodes.push(rainSource);

      // 2. RANDOM WATER DROPLET PLINKS (Distinct acoustic drops!)
      const spawnDroplet = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();

        // Droplet frequency sweep from high to mid
        const startFreq = 1600 + Math.random() * 900;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(startFreq, now);
        dropOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.6, now + 0.07);

        dropGain.gain.setValueAtTime(0.08 + Math.random() * 0.08, now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        dropOsc.connect(dropGain);
        dropGain.connect(this.ambientGain);

        dropOsc.start(now);
        dropOsc.stop(now + 0.09);

        // Schedule next drop between 180ms and 650ms
        const nextTime = 180 + Math.random() * 470;
        const timerId = setTimeout(spawnDroplet, nextTime);
        this.ambientTimers.push(timerId);
      };
      spawnDroplet();

      // 3. DISTANT ROLLING THUNDER (Soft low rumble every ~18s)
      const spawnThunder = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const thunderSource = ctx.createBufferSource();
        thunderSource.buffer = createNoiseBuffer('brown');

        const thunderFilter = ctx.createBiquadFilter();
        thunderFilter.type = 'lowpass';
        thunderFilter.frequency.setValueAtTime(130, now);

        const tGain = ctx.createGain();
        tGain.gain.setValueAtTime(0.001, now);
        tGain.gain.linearRampToValueAtTime(0.35, now + 1.2);
        tGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        thunderSource.connect(thunderFilter);
        thunderFilter.connect(tGain);
        tGain.connect(this.ambientGain);

        thunderSource.start(now);
        thunderSource.stop(now + 4.6);

        const nextThunder = 14000 + Math.random() * 12000;
        const timerId = setTimeout(spawnThunder, nextThunder);
        this.ambientTimers.push(timerId);
      };
      const thunderTimer = setTimeout(spawnThunder, 4000);
      this.ambientTimers.push(thunderTimer);

    } else if (soundType === 'forest') {
      // 1. SOFT BREEZE RUSTLE
      const windSource = ctx.createBufferSource();
      windSource.buffer = createNoiseBuffer('pink');
      windSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(550, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.2, ctx.currentTime);

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.ambientGain);
      windSource.start();
      activeNodes.push(windSource);

      // 2. PROCEDURAL BIRD CHIRPS (Beautiful FM frequency sweeps!)
      const spawnBirdChirp = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const chirpCount = 1 + Math.floor(Math.random() * 3); // 1 to 3 chirp pulses

        for (let i = 0; i < chirpCount; i++) {
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          const chirpStart = now + i * 0.12;
          const baseFreq = 2800 + Math.random() * 1200;

          chirpOsc.type = 'sine';
          chirpOsc.frequency.setValueAtTime(baseFreq, chirpStart);
          chirpOsc.frequency.linearRampToValueAtTime(baseFreq + 600, chirpStart + 0.04);
          chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq - 300, chirpStart + 0.09);

          chirpGain.gain.setValueAtTime(0.001, chirpStart);
          chirpGain.gain.linearRampToValueAtTime(0.12, chirpStart + 0.02);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.09);

          chirpOsc.connect(chirpGain);
          chirpGain.connect(this.ambientGain);

          chirpOsc.start(chirpStart);
          chirpOsc.stop(chirpStart + 0.1);
        }

        const nextBird = 2200 + Math.random() * 4500;
        const timerId = setTimeout(spawnBirdChirp, nextBird);
        this.ambientTimers.push(timerId);
      };
      const initialBird = setTimeout(spawnBirdChirp, 1200);
      this.ambientTimers.push(initialBird);

    } else if (soundType === 'cafe') {
      // 1. WARM BACKGROUND CHATTER WASH
      const cafeSource = ctx.createBufferSource();
      cafeSource.buffer = createNoiseBuffer('brown');
      cafeSource.loop = true;

      const cafeFilter = ctx.createBiquadFilter();
      cafeFilter.type = 'bandpass';
      cafeFilter.frequency.setValueAtTime(450, ctx.currentTime);
      cafeFilter.Q.setValueAtTime(1.2, ctx.currentTime);

      const cafeGain = ctx.createGain();
      cafeGain.gain.setValueAtTime(0.35, ctx.currentTime);

      cafeSource.connect(cafeFilter);
      cafeFilter.connect(cafeGain);
      cafeGain.connect(this.ambientGain);
      cafeSource.start();
      activeNodes.push(cafeSource);

      // 2. CERAMIC CUP & SPOON CLINK
      const spawnCupClink = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const clinkOsc = ctx.createOscillator();
        const clinkGain = ctx.createGain();

        const clinkFreq = 1800 + Math.random() * 800;
        clinkOsc.type = 'sine';
        clinkOsc.frequency.setValueAtTime(clinkFreq, now);

        clinkGain.gain.setValueAtTime(0.12, now);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        clinkOsc.connect(clinkGain);
        clinkGain.connect(this.ambientGain);

        clinkOsc.start(now);
        clinkOsc.stop(now + 0.3);

        const nextClink = 4500 + Math.random() * 7000;
        const timerId = setTimeout(spawnCupClink, nextClink);
        this.ambientTimers.push(timerId);
      };
      const cupTimer = setTimeout(spawnCupClink, 2500);
      this.ambientTimers.push(cupTimer);

    } else if (soundType === 'binaural') {
      // 40Hz GAMMA DEEP FOCUS DRONE (Warm harmonic pad + true 40Hz binaural difference)
      const merger = ctx.createChannelMerger(2);

      // Left Channel: 210Hz
      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'triangle';
      oscLeft.frequency.setValueAtTime(210, ctx.currentTime);

      // Right Channel: 250Hz (Creates exact 40Hz beat oscillation in brain)
      const oscRight = ctx.createOscillator();
      oscRight.type = 'triangle';
      oscRight.frequency.setValueAtTime(250, ctx.currentTime);

      // Warm Root Drone (105Hz) to make it musical and relaxing
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(105, ctx.currentTime);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.25, ctx.currentTime);

      oscLeft.connect(merger, 0, 0);  // Left ear
      oscRight.connect(merger, 0, 1); // Right ear
      droneOsc.connect(droneGain);
      droneGain.connect(merger, 0, 0);
      droneGain.connect(merger, 0, 1);

      merger.connect(this.ambientGain);

      oscLeft.start();
      oscRight.start();
      droneOsc.start();

      activeNodes.push(oscLeft, oscRight, droneOsc);

    } else {
      // 'brown': DEEP SPACE RUMBLE (Warm low-frequency ocean)
      const brownSource = ctx.createBufferSource();
      brownSource.buffer = createNoiseBuffer('brown');
      brownSource.loop = true;

      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(190, ctx.currentTime);

      const bGain = ctx.createGain();
      bGain.gain.setValueAtTime(0.65, ctx.currentTime);

      brownSource.connect(lowFilter);
      lowFilter.connect(bGain);
      bGain.connect(this.ambientGain);

      brownSource.start();
      activeNodes.push(brownSource);
    }

    this.ambientSource = {
      stop: () => {
        activeNodes.forEach(node => {
          try {
            node.stop();
          } catch {
            // Already stopped
          }
        });
      }
    };
  }

  /**
   * Adjusts volume of running ambient sound
   */
  setAmbientVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        Math.max(0.001, volume * 0.7),
        this.ctx.currentTime
      );
    }
  }

  /**
   * Stops currently playing ambient sound and clears all effect timers
   */
  stopAmbient() {
    this.clearAmbientTimers();

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      setTimeout(() => {
        if (this.ambientSource) {
          try {
            this.ambientSource.stop();
          } catch {
            // Already stopped
          }
          this.ambientSource = null;
        }
      }, 400);
    }
    this.currentAmbientType = null;
  }
}

export const audioEngine = new AudioEngine();
