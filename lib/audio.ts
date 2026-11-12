/**
 * Film sound, synthesized with Web Audio (no files to license or download).
 * TODO(asset): swap synth cues for recorded ones if they sound better on real devices.
 * Rules: nothing before a user gesture, master limiter, shot at −6 dB, mute persists.
 */
export type Cue = "shot" | "shimmer" | "riser" | "pulse" | "resolve";

const KEY = "site-muted";
let ctx: AudioContext | null = null;
let master: GainNode;
let reverb: ConvolverNode;
let drone: GainNode;
let muted = false;
try {
  muted = typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";
} catch {}

function noise(c: AudioContext, seconds: number, brown = false) {
  const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w;
  }
  return b;
}

function impulse(c: AudioContext, seconds: number) {
  const b = c.createBuffer(2, c.sampleRate * seconds, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  }
  return b;
}

const env = (g: GainNode, t: number, peak: number, attack: number, decay: number) => {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
};

function build(c: AudioContext) {
  const limiter = c.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.2;
  limiter.connect(c.destination);
  master = c.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(limiter);
  reverb = c.createConvolver();
  reverb.buffer = impulse(c, 2.2);
  const wet = c.createGain();
  wet.gain.value = 0.35;
  reverb.connect(wet).connect(master);

  // Room-tone drone (≈ −30 dB): detuned low saws + brown noise, slowly breathing filter.
  drone = c.createGain();
  drone.gain.value = 0;
  drone.connect(master);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 170;
  lp.Q.value = 3;
  lp.connect(drone);
  for (const f of [55, 55.4, 82.6]) {
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.connect(lp);
    o.start();
  }
  const lfo = c.createOscillator();
  const lfoAmt = c.createGain();
  lfo.frequency.value = 0.07;
  lfoAmt.gain.value = 60;
  lfo.connect(lfoAmt).connect(lp.frequency);
  lfo.start();
  const n = c.createBufferSource();
  n.buffer = noise(c, 4, true);
  n.loop = true;
  const ng = c.createGain();
  ng.gain.value = 0.5;
  n.connect(ng).connect(lp);
  n.start();
}

function play(cue: Cue) {
  if (!ctx || ctx.state !== "running") return;
  const c = ctx;
  const t = c.currentTime + 0.005;
  const out = (gain: number, toReverb = true) => {
    const g = c.createGain();
    g.gain.value = gain;
    g.connect(master);
    if (toReverb) g.connect(reverb);
    return g;
  };

  if (cue === "shot") {
    const bus = out(0.5); // −6 dB
    const body = c.createBufferSource();
    body.buffer = noise(c, 0.6);
    const bodyLp = c.createBiquadFilter();
    bodyLp.type = "lowpass";
    bodyLp.frequency.setValueAtTime(5000, t);
    bodyLp.frequency.exponentialRampToValueAtTime(300, t + 0.3);
    const bodyG = c.createGain();
    env(bodyG, t, 0.9, 0.001, 0.32);
    body.connect(bodyLp).connect(bodyG).connect(bus);
    body.start(t);

    const crack = c.createBufferSource();
    crack.buffer = noise(c, 0.05);
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2500;
    const crackG = c.createGain();
    env(crackG, t, 0.7, 0.0005, 0.03);
    crack.connect(hp).connect(crackG).connect(bus);
    crack.start(t);

    const thump = c.createOscillator();
    thump.frequency.setValueAtTime(140, t);
    thump.frequency.exponentialRampToValueAtTime(38, t + 0.18);
    const thumpG = c.createGain();
    env(thumpG, t, 1, 0.002, 0.4);
    thump.connect(thumpG).connect(bus);
    thump.start(t);
    thump.stop(t + 0.5);
  }

  if (cue === "shimmer") {
    const bus = out(0.05);
    for (const [f, a] of [[1243, 1], [1877, 0.7], [2719, 0.5], [3391, 0.3]]) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const g = c.createGain();
      env(g, t, a, 0.04, 1.6);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + 1.8);
    }
  }

  if (cue === "riser") {
    const bus = out(0.06);
    const s = c.createBufferSource();
    s.buffer = noise(c, 3);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(180, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 2.8);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1, t + 2.8);
    g.gain.linearRampToValueAtTime(0, t + 3);
    s.connect(bp).connect(g).connect(bus);
    s.start(t);
  }

  if (cue === "pulse" || cue === "resolve") {
    const bus = out(cue === "pulse" ? 0.35 : 0.18);
    const beats = cue === "pulse" ? [0, 0.3, 1.4, 1.7] : [0];
    for (const b of beats) {
      const o = c.createOscillator();
      o.frequency.setValueAtTime(cue === "pulse" ? 62 : 49, t + b);
      if (cue === "pulse") o.frequency.exponentialRampToValueAtTime(40, t + b + 0.15);
      const g = c.createGain();
      env(g, t + b, 1, cue === "pulse" ? 0.01 : 0.3, cue === "pulse" ? 0.25 : 2);
      o.connect(g).connect(bus);
      o.start(t + b);
      o.stop(t + b + 2.5);
    }
  }
}

export const audio = {
  get running() {
    return !!ctx && ctx.state === "running";
  },
  get muted() {
    return muted;
  },
  /** Call from a user gesture only. Starts the drone. */
  async unlock() {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      build(ctx);
    }
    await ctx.resume();
    drone.gain.setTargetAtTime(0.035, ctx.currentTime, 1.5);
  },
  setMuted(m: boolean) {
    muted = m;
    try {
      localStorage.setItem(KEY, m ? "1" : "0");
    } catch {}
    if (ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05);
  },
  /** 0..1 — fades the drone out at the end of the film. */
  setDroneLevel(level: number) {
    if (ctx) drone.gain.setTargetAtTime(0.035 * level, ctx.currentTime, 0.2);
  },
  play,
};
