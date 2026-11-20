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
      // 1. PENDULUM TICK-TOCK (Dual-click mechanical escapement: primary tick + micro body resonance)
      let isTick = true;
      const playTickTock = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // Primary click (escapement pallet tooth engagement)
        const primaryOsc = ctx.createOscillator();
        const primaryGain = ctx.createGain();
        const primaryFreq = isTick ? 1250 : 920;

        primaryOsc.type = 'triangle';
        primaryOsc.frequency.setValueAtTime(primaryFreq, now);
        primaryOsc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

        primaryGain.gain.setValueAtTime(0.38, now);
        primaryGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        primaryOsc.connect(primaryGain);
        primaryGain.connect(this.ambientGain);

        primaryOsc.start(now);
        primaryOsc.stop(now + 0.03);

        // Secondary micro-resonance 15ms later (wooden clock case echo)
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        const bodyFreq = isTick ? 440 : 330;
        const bodyStart = now + 0.015;

        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(bodyFreq, bodyStart);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, bodyStart + 0.04);

        bodyGain.gain.setValueAtTime(0.18, bodyStart);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, bodyStart + 0.04);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(this.ambientGain);

        bodyOsc.start(bodyStart);
        bodyOsc.stop(bodyStart + 0.045);

        isTick = !isTick;
      };

      // Play immediately, then every 1000ms
      playTickTock();
      const intervalId = setInterval(playTickTock, 1000);
      this.ambientTimers.push(intervalId);

    } else if (resolvedType === 'waves') {
      // 2. OCEAN WAVES & TIDE (Multi-layer surf: low sub-bass surge + airy receding foam wash)
      const waveNoise = ctx.createBufferSource();
      waveNoise.buffer = createNoiseBuffer('pink');
      waveNoise.loop = true;

      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'bandpass';
      waveFilter.Q.value = 1.2;
      waveFilter.frequency.setValueAtTime(280, ctx.currentTime);

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.06, ctx.currentTime);

      // Deep sub-bass surf surge
      const subNoise = ctx.createBufferSource();
      subNoise.buffer = createNoiseBuffer('brown');
      subNoise.loop = true;

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(140, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.1, ctx.currentTime);

      waveNoise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(this.ambientGain);

      subNoise.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(this.ambientGain);

      waveNoise.start();
      subNoise.start();
      activeNodes.push(waveNoise, subNoise);

      // 6-second wave cycle
      const swellCycle = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // Wave crests up over 2.6s, washes down over 3.4s
        waveFilter.frequency.cancelScheduledValues(now);
        waveGain.gain.cancelScheduledValues(now);
        subGain.gain.cancelScheduledValues(now);

        waveFilter.frequency.setValueAtTime(260, now);
        waveFilter.frequency.exponentialRampToValueAtTime(1450, now + 2.6);
        waveFilter.frequency.exponentialRampToValueAtTime(260, now + 5.8);

        waveGain.gain.setValueAtTime(0.08, now);
        waveGain.gain.linearRampToValueAtTime(0.65, now + 2.6);
        waveGain.gain.linearRampToValueAtTime(0.08, now + 5.8);

        subGain.gain.setValueAtTime(0.12, now);
        subGain.gain.linearRampToValueAtTime(0.55, now + 2.4);
        subGain.gain.linearRampToValueAtTime(0.12, now + 5.8);
      };

      swellCycle();
      const swellInterval = setInterval(swellCycle, 6000);
      this.ambientTimers.push(swellInterval);

    } else if (resolvedType === 'fire') {
      // 3. CRACKLING CAMPFIRE (Warm low fireplace hum + organic wood pops and crackling ember bursts)
      const fireHum = ctx.createBufferSource();
      fireHum.buffer = createNoiseBuffer('brown');
      fireHum.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(280, ctx.currentTime);

      const fireGain = ctx.createGain();
      fireGain.gain.setValueAtTime(0.28, ctx.currentTime);

      fireHum.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(this.ambientGain);
      fireHum.start();
      activeNodes.push(fireHum);

      // Organic wood crackle bursts
      const spawnCrackle = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // High frequency filtered burst
        const crackleOsc = ctx.createOscillator();
        const crackleGain = ctx.createGain();
        const snapFreq = 2600 + Math.random() * 2400;

        crackleOsc.type = 'triangle';
        crackleOsc.frequency.setValueAtTime(snapFreq, now);

        crackleGain.gain.setValueAtTime(0.1 + Math.random() * 0.15, now);
        crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

        crackleOsc.connect(crackleGain);
        crackleGain.connect(this.ambientGain);

        crackleOsc.start(now);
        crackleOsc.stop(now + 0.025);

        // Occasional hollow wood pop (splitting wood)
        if (Math.random() < 0.25) {
          const popOsc = ctx.createOscillator();
          const popGain = ctx.createGain();
          popOsc.type = 'sine';
          popOsc.frequency.setValueAtTime(220 + Math.random() * 80, now);
          popGain.gain.setValueAtTime(0.12, now);
          popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          popOsc.connect(popGain);
          popGain.connect(this.ambientGain);
          popOsc.start(now);
          popOsc.stop(now + 0.045);
        }

        const nextCrackle = 50 + Math.random() * 280;
        const timerId = setTimeout(spawnCrackle, nextCrackle);
        this.ambientTimers.push(timerId);
      };
      spawnCrackle();

    } else if (resolvedType === 'rain') {
      // 4. RAIN & THUNDER (Velvety soft rainfall wash + authentic droplet pings + distant rolling thunder)
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = createNoiseBuffer('pink');
      rainSource.loop = true;

      // Dual-filter for soothing rain texture (cuts mud below 180Hz, softens harsh highs above 1400Hz)
      const rainLowFilter = ctx.createBiquadFilter();
      rainLowFilter.type = 'lowpass';
      rainLowFilter.frequency.setValueAtTime(1400, ctx.currentTime);

      const rainHighFilter = ctx.createBiquadFilter();
      rainHighFilter.type = 'highpass';
      rainHighFilter.frequency.setValueAtTime(180, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.42, ctx.currentTime);

      rainSource.connect(rainLowFilter);
      rainLowFilter.connect(rainHighFilter);
      rainHighFilter.connect(rainGain);
      rainGain.connect(this.ambientGain);
      rainSource.start();
      activeNodes.push(rainSource);

      // Distinct water droplets with varying acoustic pitch
      const spawnDroplet = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();

        const startFreq = 1400 + Math.random() * 1100;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(startFreq, now);
        dropOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.48, now + 0.055);

        dropGain.gain.setValueAtTime(0.08 + Math.random() * 0.04, now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        dropOsc.connect(dropGain);
        dropGain.connect(this.ambientGain);

        dropOsc.start(now);
        dropOsc.stop(now + 0.065);

        const nextTime = 120 + Math.random() * 380;
        const timerId = setTimeout(spawnDroplet, nextTime);
        this.ambientTimers.push(timerId);
      };
      spawnDroplet();

      // Deep rolling thunder with smooth multi-second rumble
      const spawnThunder = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;
        const thunderSource = ctx.createBufferSource();
        thunderSource.buffer = createNoiseBuffer('brown');

        const thunderFilter = ctx.createBiquadFilter();
        thunderFilter.type = 'lowpass';
        thunderFilter.frequency.setValueAtTime(110, now);
        thunderFilter.frequency.linearRampToValueAtTime(160, now + 1.2);
        thunderFilter.frequency.exponentialRampToValueAtTime(90, now + 4.5);

        const tGain = ctx.createGain();
        tGain.gain.setValueAtTime(0.001, now);
        tGain.gain.linearRampToValueAtTime(0.45, now + 1.4);
        tGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

        thunderSource.connect(thunderFilter);
        thunderFilter.connect(tGain);
        tGain.connect(this.ambientGain);

        thunderSource.start(now);
        thunderSource.stop(now + 5.0);

        const nextThunder = 14000 + Math.random() * 12000;
        const timerId = setTimeout(spawnThunder, nextThunder);
        this.ambientTimers.push(timerId);
      };
      const thunderTimer = setTimeout(spawnThunder, 2500);
      this.ambientTimers.push(thunderTimer);

    } else {
      // 5. 'singing_bowl' - TIBETAN SINGING BOWL (Acoustic rotary shimmer + multi-harmonic mallet strikes)
      const bowlFundamental = 261.63; // C4 (261.6Hz)
      const harmonics = [1, 2.76, 5.4, 8.9];

      const bowlGain = ctx.createGain();
      bowlGain.gain.setValueAtTime(0.28, ctx.currentTime);
      bowlGain.connect(this.ambientGain);

      // Acoustic rotary amplitude modulation (LFO emulation of circular wand vibration)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.32, ctx.currentTime); // ~0.32Hz slow rotary breathing
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bowlGain.gain);
      lfo.start();
      activeNodes.push(lfo);

      harmonics.forEach((h, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(bowlFundamental * h, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.22 / Math.pow(1.5, idx), ctx.currentTime);

        osc.connect(noteGain);
        noteGain.connect(bowlGain);

        osc.start();
        activeNodes.push(osc);
      });

      // Harmonic mallet bell strike every 7.5 seconds
      const strikeBowl = () => {
        if (!this.currentAmbientType) return;
        const now = ctx.currentTime;

        // C5 strike (523Hz)
        const strikeOsc = ctx.createOscillator();
        const strikeGain = ctx.createGain();
        strikeOsc.type = 'sine';
        strikeOsc.frequency.setValueAtTime(523.25, now);
        strikeGain.gain.setValueAtTime(0.22, now);
        strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        strikeOsc.connect(strikeGain);
        strikeGain.connect(this.ambientGain);
        strikeOsc.start(now);
        strikeOsc.stop(now + 4.6);

        // High crystal overtone C6 (1046.5Hz)
        const overtoneOsc = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtoneOsc.type = 'sine';
        overtoneOsc.frequency.setValueAtTime(1046.5, now);
        overtoneGain.gain.setValueAtTime(0.09, now);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(this.ambientGain);
        overtoneOsc.start(now);
        overtoneOsc.stop(now + 3.0);

        const nextStrike = 7000 + Math.random() * 3500;
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
