import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audio, type Cue } from "@/lib/audio";
import { flash } from "./FlashSequence";

gsap.registerPlugin(ScrollTrigger);

/** Plain state animated by GSAP and read in useFrame. Never React state. */
export const filmState = {
  progress: 0,
  pistol: { dolly: 0, sweep: 0, spot: 0, rim: 0.05, fill: 0 },
  orbit: 0, // camera swings round to a three-quarter view of the muzzle
  pull: 0, // camera pulls back after the shot
  key: 1, // overall light level
  arrive: 0, // edge light as the pistol emerges
};

export { flash };

export type FilmEls = {
  section: HTMLElement;
  title: HTMLElement;
  hint: HTMLElement;
  lines: HTMLElement[];
  stage: HTMLElement; // canvas wrapper
  wipe: HTMLElement;
  bar: HTMLElement;
};

const CUES: [number, Cue][] = [
  [0.18, "shimmer"],
  [0.4, "riser"],
  [0.62, "pulse"],
  [0.94, "resolve"],
];
const SHOT_AT = 0.52;
const REARM_BELOW = 0.5;

export function createFilmTimeline(els: FilmEls) {
  const S = filmState;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: els.section, start: "top top", end: "bottom bottom", scrub: 0.6 },
  });

  const typeIn = (el: HTMLElement, at: number, out: number) => {
    tl.fromTo(el, { opacity: 1, clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.025, ease: "steps(14)" }, at);
    tl.to(el, { opacity: 0, duration: 0.012 }, out);
  };
  const fadeIn = (el: HTMLElement, at: number, out: number) => {
    tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.015 }, at);
    tl.to(el, { opacity: 0, duration: 0.012 }, out);
  };

  // Explicit start values: the title/hint have CSS fade-ins, and GSAP must not record their mid-fade opacity.
  gsap.set([els.title, els.hint], { opacity: 1, y: 0 });
  tl.to(S, { progress: 1, duration: 1 }, 0);
  tl.fromTo(els.bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
  tl.to(els.hint, { opacity: 0, duration: 0.01 }, 0.004);

  // 1. Title out; the pistol emerges under a sweeping spotlight.
  tl.to(els.title, { opacity: 0, y: -16, duration: 0.04 }, 0.1);
  tl.to(S.pistol, { dolly: 1, duration: 0.2, ease: "power1.inOut" }, 0.08);
  tl.to(S.pistol, { spot: 1, duration: 0.04 }, 0.08);
  tl.to(S.pistol, { sweep: 1, duration: 0.16, ease: "power1.inOut" }, 0.09);
  tl.to(S.pistol, { rim: 0.25, duration: 0.2 }, 0.08);
  tl.to(S.pistol, { fill: 1, duration: 0.04 }, 0.235);
  tl.to(S, { arrive: 1, duration: 0.035, ease: "power2.out" }, 0.08);
  tl.to(S, { arrive: 0.35, duration: 0.07, ease: "power1.inOut" }, 0.12);
  typeIn(els.lines[0], 0.16, 0.212);
  typeIn(els.lines[1], 0.22, 0.262);

  // 2. Orbit to the muzzle.
  tl.to(S, { orbit: 1, duration: 0.2, ease: "power2.inOut" }, 0.28);
  fadeIn(els.lines[2], 0.33, 0.43);
  tl.to(S, { key: 0.45, duration: 0.06 }, 0.44);

  // 3. The shot (time-based flash sequence at SHOT_AT), then darkness and a pull back.
  tl.to(S, { key: 0.12, duration: 0.04 }, 0.53);
  tl.to(S, { pull: 1, duration: 0.3, ease: "power1.inOut" }, 0.58);
  tl.to(S, { key: 0.6, duration: 0.2 }, 0.62);
  fadeIn(els.lines[3], 0.7, 0.835);

  // 4. Wipe into the site.
  tl.fromTo(els.wipe, { opacity: 0, "--r": "0%" }, { opacity: 1, duration: 0.03 }, 0.91);
  tl.to(els.wipe, { "--r": "160%", duration: 0.055, ease: "power1.in" }, 0.94);
  tl.to(els.stage, { opacity: 0, duration: 0.03 }, 0.95);

  // Cues follow the scrubbed (smoothed) progress so sound lines up with what's on screen.
  let last = 0;
  let armed = true;
  tl.eventCallback("onUpdate", () => {
    const p = tl.progress();
    for (const [at, cue] of CUES) if (last < at && p >= at) audio.play(cue);
    if (armed && p >= SHOT_AT && last < SHOT_AT + 0.02) {
      armed = false;
      if (flash.fire(performance.now())) audio.play("shot");
    }
    if (p < REARM_BELOW) armed = true;
    audio.setDroneLevel(p < 0.94 ? 1 : Math.max(0, (1 - p) / 0.06));
    last = p;
  });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export { gsap, ScrollTrigger };
