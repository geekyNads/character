export type Tier = "full" | "lite" | "video" | "still";

type Signals = { reducedMotion: boolean; webgl2: boolean; mobile: boolean; saveData: boolean; lowCores: boolean };

/** Capability tiers. Reduced motion wins, then WebGL, then device class. */
export function pickTier(s: Signals): Tier {
  if (s.reducedMotion) return "still";
  if (!s.webgl2) return "video";
  if (s.mobile || s.saveData || s.lowCores) return "lite";
  return "full";
}

// ponytail: heuristics instead of detect-gpu; add it if low-tier laptops struggle on "full".
export function detectTier(): Tier {
  let webgl2 = false;
  try {
    webgl2 = !!document.createElement("canvas").getContext("webgl2");
  } catch {}
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return pickTier({
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl2,
    mobile: matchMedia("(pointer: coarse)").matches || innerWidth < 760,
    saveData: !!nav.connection?.saveData,
    lowCores: (navigator.hardwareConcurrency ?? 8) <= 4,
  });
}
