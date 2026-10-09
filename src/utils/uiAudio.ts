/**
 * uiAudio.ts
 * Procedural Web Audio API sound effects for Apex GT UI interactions.
 * Delivers crisp, tactile acoustic feedback for clicks, hovers, mode transitions,
 * and cinematic engine ignition roars without external sound assets.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Subtle high-tech hover sound for menu buttons
 */
export function playUiHover(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * Tactile, crisp UI click with customizable frequency punch
 */
export function playUiClick(freq: number = 800): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * Ascending harmonic chime for selecting race modes
 */
export function playModeSelectChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.055;
      const duration = 0.28;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.045, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * High-octane V12 Endurance Prototype ignition roar sequence with open-exhaust flare and detonation pops
 */
export function playEngineIgnitionRoar(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. High-compression racing starter solenoid pulses
    for (let i = 0; i < 4; i++) {
      const crankOsc = ctx.createOscillator();
      const crankGain = ctx.createGain();
      const crankTime = now + i * 0.055;

      crankOsc.type = 'sawtooth';
      crankOsc.frequency.setValueAtTime(140 + i * 22, crankTime);

      crankGain.gain.setValueAtTime(0.08, crankTime);
      crankGain.gain.exponentialRampToValueAtTime(0.001, crankTime + 0.038);

      crankOsc.connect(crankGain);
      crankGain.connect(ctx.destination);

      crankOsc.start(crankTime);
      crankOsc.stop(crankTime + 0.045);
    }

    // 2. High-torque pneumatic starter motor whir (warm mechanical spin, zero whistle)
    const starterWhir = ctx.createOscillator();
    const starterFilter = ctx.createBiquadFilter();
    const starterGain = ctx.createGain();
    const starterStart = now + 0.08;
    const starterEnd = now + 0.28;

    starterWhir.type = 'sawtooth';
    starterWhir.frequency.setValueAtTime(160, starterStart);
    starterWhir.frequency.exponentialRampToValueAtTime(320, starterEnd);

    starterFilter.type = 'lowpass';
    starterFilter.frequency.setValueAtTime(750, starterStart);

    starterGain.gain.setValueAtTime(0.001, starterStart);
    starterGain.gain.linearRampToValueAtTime(0.09, starterStart + 0.06);
    starterGain.gain.exponentialRampToValueAtTime(0.001, starterEnd);

    starterWhir.connect(starterFilter);
    starterFilter.connect(starterGain);
    starterGain.connect(ctx.destination);

    starterWhir.start(starterStart);
    starterWhir.stop(starterEnd);

    // 3. V12 Combustion Ignition Roar (Violent rev flare to 6500 RPM followed by lumpy idle settling)
    const roarTime = now + 0.25;
    const roarDuration = 1.15;

    // Sub-bass physical chest punch
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(80, roarTime);
    subOsc.frequency.exponentialRampToValueAtTime(320, roarTime + 0.22); // Rapid rev-up surge
    subOsc.frequency.exponentialRampToValueAtTime(110, roarTime + roarDuration); // Settling to idle

    subGain.gain.setValueAtTime(0.12, roarTime);
    subGain.gain.exponentialRampToValueAtTime(0.24, roarTime + 0.20);
    subGain.gain.exponentialRampToValueAtTime(0.001, roarTime + roarDuration);

    const roarFilter = ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(850, roarTime);
    roarFilter.frequency.exponentialRampToValueAtTime(3600, roarTime + 0.22);
    roarFilter.frequency.exponentialRampToValueAtTime(950, roarTime + roarDuration);

    subOsc.connect(roarFilter);
    roarFilter.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(roarTime);
    subOsc.stop(roarTime + roarDuration + 0.05);

    // V12 Metallic collector scream (6-into-1 high-order rasp)
    const screamOsc = ctx.createOscillator();
    const screamGain = ctx.createGain();
    screamOsc.type = 'sawtooth';
    screamOsc.frequency.setValueAtTime(180, roarTime);
    screamOsc.frequency.exponentialRampToValueAtTime(680, roarTime + 0.22);
    screamOsc.frequency.exponentialRampToValueAtTime(220, roarTime + roarDuration);

    screamGain.gain.setValueAtTime(0.07, roarTime);
    screamGain.gain.exponentialRampToValueAtTime(0.18, roarTime + 0.22);
    screamGain.gain.exponentialRampToValueAtTime(0.001, roarTime + roarDuration);

    screamOsc.connect(roarFilter);
    screamOsc.start(roarTime);
    screamOsc.stop(roarTime + roarDuration + 0.05);

    // Open-exhaust gas shockwave blast (noise through peaking bandpass)
    const bufferSize = Math.floor(ctx.sampleRate * 0.55);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(950, roarTime + 0.06);
    noiseFilter.Q.setValueAtTime(1.8, roarTime + 0.06);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, roarTime + 0.06);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, roarTime + 0.52);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(roarTime + 0.06);
    whiteNoise.stop(roarTime + 0.55);

    // 4. Staggered open-exhaust backfire detonations during rev drop ("POP! BANG!")
    [0.56, 0.82].forEach((popOffset, idx) => {
      const popTime = now + popOffset;

      // Crack transient
      const popBufferLen = Math.floor(ctx.sampleRate * 0.12);
      const popBuf = ctx.createBuffer(1, popBufferLen, ctx.sampleRate);
      const popData = popBuf.getChannelData(0);
      for (let i = 0; i < popBufferLen; i++) {
        popData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018));
      }

      const pNoise = ctx.createBufferSource();
      pNoise.buffer = popBuf;

      const pFilter = ctx.createBiquadFilter();
      pFilter.type = 'bandpass';
      pFilter.frequency.setValueAtTime(idx === 0 ? 1450 : 1150, popTime);
      pFilter.Q.setValueAtTime(2.2, popTime);

      const pGain = ctx.createGain();
      pGain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.16, popTime);
      pGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.10);

      pNoise.connect(pFilter);
      pFilter.connect(pGain);
      pGain.connect(ctx.destination);
      pNoise.start(popTime);

      // Low thump
      const pOsc = ctx.createOscillator();
      pOsc.type = 'triangle';
      pOsc.frequency.setValueAtTime(idx === 0 ? 150 : 110, popTime);
      pOsc.frequency.exponentialRampToValueAtTime(32, popTime + 0.10);

      const pOscGain = ctx.createGain();
      pOscGain.gain.setValueAtTime(idx === 0 ? 0.20 : 0.14, popTime);
      pOscGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.11);

      pOsc.connect(pOscGain);
      pOscGain.connect(ctx.destination);
      pOsc.start(popTime);
      pOsc.stop(popTime + 0.12);
    });
  } catch {
    // Audio context may not be ready yet
  }
}
