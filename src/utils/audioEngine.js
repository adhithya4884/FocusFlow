// src/utils/audioEngine.js
// Procedural Web Audio API sound generator - 100% offline, zero external audio asset dependencies!

export const AMBIENT_SOUND_OPTIONS = [
  {
    id: 'rain',
    label: '🌧️ Rain & Thunder',
    shortLabel: '🌧️ Rain',
    icon: '🌧️',
    desc: 'Gentle rainfall droplets with distant rolling thunder rumbles'
  },
  {
    id: 'waves',
    label: '🌊 Ocean Waves & Tide',
    shortLabel: '🌊 Waves',
    icon: '🌊',
    desc: '5-second cyclic swells and relaxing crashing surf'
  },
  {
    id: 'fire',
    label: '🔥 Crackling Campfire',
    shortLabel: '🔥 Campfire',
    icon: '🔥',
    desc: 'Warm hearth hum with rapid wooden pops and ember snaps'
  },
  {
    id: 'clock',
    label: '⏰ Clockwork Pendulum',
    shortLabel: '⏰ Clock',
    icon: '⏰',
    desc: 'Hypnotic, rhythmic tick-tock mechanical grandfather clock (1s pace)'
  },
  {
    id: 'singing_bowl',
    label: '🥣 Tibetan Singing Bowl',
    shortLabel: '🥣 Zen Bowl',
    icon: '🥣',
    desc: 'Serene bronze overtone drone with harmonic meditation mallet strikes'
  }
];

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
    this.ambientTimers = [];
  }

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

  clearAmbientTimers() {
    this.ambientTimers.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });
    this.ambientTimers = [];
  }

  /**
   * Dedicated Notification Sound (Crisp Two-Tone Ding-Dong)
   */
  playNotificationSound(volume = 0.7) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880]; // E5 -> A5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.14;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * 0.45, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.65);
    });
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
   * 5 DRAMATICALLY DISTINCT PROCEDURAL SOUNDSCAPES:
   * 1. 'clock' - Rhythmic Pendulum Clock (Tick... Tock... Tick... Tock)
   * 2. 'waves' - Rolling Ocean Tide (Rhythmic 4-second swell & crashing wash)
   * 3. 'fire' - Crackling Campfire (Organic snaps, ember crackles & warm low glow)
   * 4. 'rain' - Rain & Rolling Thunder (Steady raindrops & deep distant thunder)
   * 5. 'singing_bowl' - Tibetan Singing Bowl (Harmonic brass resonance & soft mallet strikes)
   */
  startAmbient(soundType = 'clock', volume = 0.5) {
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Backward compatibility mapping for any older cached sound keys in LocalStorage
    const soundMap = {
      forest: 'waves',
      cafe: 'fire',
      binaural: 'singing_bowl',
      brown: 'clock'
    };
    const resolvedType = soundMap[soundType] || soundType;

    this.currentAmbientType = resolvedType;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(volume * 0.75, ctx.currentTime + 0.5);
    this.ambientGain.connect(ctx.destination);

    const activeNodes = [];

    // Helper: Pink/Brown noise buffer generator
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
      } else {
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
      }
      return buffer;
    };

    if (resolvedType === 'clock') {
      // 1. PENDULUM TICK-TOCK (Rhythmic wooden mechanical ticks every 1 second)
      let isTick = true;
      const playTickTock = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternating pitch: 850Hz for "Tick", 620Hz for "Tock"
        const freq = isTick ? 850 : 620;
        isTick = !isTick;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(now);
        osc.stop(now + 0.04);
      };

      // Play immediately, then every 1000ms
      playTickTock();
      const intervalId = setInterval(playTickTock, 1000);
      this.ambientTimers.push(intervalId);

    } else if (resolvedType === 'waves') {
      // 2. OCEAN WAVES & TIDE (Rhythmic swell rising and crashing every 5 seconds)
      const waveNoise = ctx.createBufferSource();
      waveNoise.buffer = createNoiseBuffer('pink');
      waveNoise.loop = true;

      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'lowpass';
      waveFilter.frequency.setValueAtTime(250, ctx.currentTime);

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.05, ctx.currentTime);

      waveNoise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(this.ambientGain);
      waveNoise.start();
      activeNodes.push(waveNoise);

      // Swell cycle: 5.5 seconds per breath of wave
      const swellCycle = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // Swell up (rising water)
        waveFilter.frequency.cancelScheduledValues(now);
        waveGain.gain.cancelScheduledValues(now);

        waveFilter.frequency.setValueAtTime(220, now);
        waveFilter.frequency.exponentialRampToValueAtTime(1200, now + 2.2); // wave crests
        waveFilter.frequency.exponentialRampToValueAtTime(220, now + 5.2);  // wave recedes

        waveGain.gain.setValueAtTime(0.08, now);
        waveGain.gain.linearRampToValueAtTime(0.7, now + 2.2);
        waveGain.gain.linearRampToValueAtTime(0.08, now + 5.2);
      };

      swellCycle();
      const swellInterval = setInterval(swellCycle, 5300);
      this.ambientTimers.push(swellInterval);

    } else if (resolvedType === 'fire') {
      // 3. CRACKLING CAMPFIRE (Warm low fire glow + organic wood snaps and crackles)
      const fireHum = ctx.createBufferSource();
      fireHum.buffer = createNoiseBuffer('brown');
      fireHum.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(220, ctx.currentTime);

      const fireGain = ctx.createGain();
      fireGain.gain.setValueAtTime(0.25, ctx.currentTime);

      fireHum.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(this.ambientGain);
      fireHum.start();
      activeNodes.push(fireHum);

      // Random snapping crackles (high frequency wooden bursts)
      const spawnCrackle = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // Fast burst crackle
        const crackleOsc = ctx.createOscillator();
        const crackleGain = ctx.createGain();
        const snapFreq = 2200 + Math.random() * 2800;

        crackleOsc.type = 'square';
        crackleOsc.frequency.setValueAtTime(snapFreq, now);

        crackleGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, now);
        crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

        crackleOsc.connect(crackleGain);
        crackleGain.connect(this.ambientGain);

        crackleOsc.start(now);
        crackleOsc.stop(now + 0.035);

        // Schedule next random crackle between 60ms and 380ms
        const nextCrackle = 60 + Math.random() * 320;
        const timerId = setTimeout(spawnCrackle, nextCrackle);
        this.ambientTimers.push(timerId);
      };
      spawnCrackle();

    } else if (resolvedType === 'rain') {
      // 4. RAIN & THUNDER (Steady rain wash + droplet plips + distant rolling thunder)
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = createNoiseBuffer('pink');
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1200, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.45, ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.ambientGain);
      rainSource.start();
      activeNodes.push(rainSource);

      // Distinct water droplets
      const spawnDroplet = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();

        const startFreq = 1600 + Math.random() * 800;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(startFreq, now);
        dropOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.55, now + 0.07);

        dropGain.gain.setValueAtTime(0.09, now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        dropOsc.connect(dropGain);
        dropGain.connect(this.ambientGain);

        dropOsc.start(now);
        dropOsc.stop(now + 0.08);

        const nextTime = 160 + Math.random() * 450;
        const timerId = setTimeout(spawnDroplet, nextTime);
        this.ambientTimers.push(timerId);
      };
      spawnDroplet();

      // Distant rolling thunder every ~18s
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
        tGain.gain.linearRampToValueAtTime(0.4, now + 1.2);
        tGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        thunderSource.connect(thunderFilter);
        thunderFilter.connect(tGain);
        tGain.connect(this.ambientGain);

        thunderSource.start(now);
        thunderSource.stop(now + 4.6);

        const nextThunder = 15000 + Math.random() * 12000;
        const timerId = setTimeout(spawnThunder, nextThunder);
        this.ambientTimers.push(timerId);
      };
      const thunderTimer = setTimeout(spawnThunder, 3000);
      this.ambientTimers.push(thunderTimer);

    } else {
      // 5. 'singing_bowl' - TIBETAN SINGING BOWL (Harmonic brass resonance + soft mallet strike)
      const bowlFundamental = 261.63; // C4
      const harmonics = [1, 2.76, 5.4, 8.9];

      const bowlGain = ctx.createGain();
      bowlGain.gain.setValueAtTime(0.3, ctx.currentTime);
      bowlGain.connect(this.ambientGain);

      harmonics.forEach((h, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(bowlFundamental * h, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.25 / Math.pow(1.5, idx), ctx.currentTime);

        osc.connect(noteGain);
        noteGain.connect(bowlGain);

        osc.start();
        activeNodes.push(osc);
      });

      // Gentle mallet chime every 8 seconds
      const strikeBowl = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const strikeOsc = ctx.createOscillator();
        const strikeGain = ctx.createGain();

        strikeOsc.type = 'sine';
        strikeOsc.frequency.setValueAtTime(523.25, now); // C5 bell strike

        strikeGain.gain.setValueAtTime(0.2, now);
        strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

        strikeOsc.connect(strikeGain);
        strikeGain.connect(this.ambientGain);

        strikeOsc.start(now);
        strikeOsc.stop(now + 4.2);

        const nextStrike = 7000 + Math.random() * 4000;
        const timerId = setTimeout(strikeBowl, nextStrike);
        this.ambientTimers.push(timerId);
      };
      const initialStrike = setTimeout(strikeBowl, 800);
      this.ambientTimers.push(initialStrike);
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

  setAmbientVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        Math.max(0.001, volume * 0.75),
        this.ctx.currentTime
      );
    }
  }

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
