/**
 * Muzzle-flash sequence (time-based, not scrubbed). Photosensitivity guard (WCAG 2.3.1):
 * exactly 3 flashes at 0/450/900 ms, 120 ms each. Never more than 3 flashes in any 1 s window,
 * including back-to-back re-fires (a new run can only start after the previous one ends).
 */
export const FLASH_ONSETS = [0, 450, 900] as const;
export const FLASH_MS = 120;
export const SEQUENCE_MS = 1400;

/** Flash intensity 0..1 at `t` ms after the shot. `reduced` = one soft glow, no strobe. */
export function flashAt(t: number, reduced = false): number {
  if (!(t >= 0 && t < SEQUENCE_MS)) return 0;
  if (reduced) return 0.55 * Math.sin((Math.PI * t) / SEQUENCE_MS);
  for (const o of FLASH_ONSETS) if (t >= o && t < o + FLASH_MS) return 1 - 0.35 * ((t - o) / FLASH_MS);
  return 0;
}

export class FlashSequence {
  private start = -Infinity;
  reduced = false;

  /** Starts a run unless one is already playing. Returns whether it started. */
  fire(now: number) {
    if (now - this.start < SEQUENCE_MS) return false;
    this.start = now;
    return true;
  }

  value(now: number) {
    return flashAt(now - this.start, this.reduced);
  }

  /** Recoil kick 0..1, decays over the first ~180 ms. */
  recoil(now: number) {
    const t = now - this.start;
    return t >= 0 && t < 180 ? 1 - t / 180 : 0;
  }

  /** 0..1 progress through the run (for the ringing tail), 1 when idle. */
  elapsed(now: number) {
    return Math.min(1, Math.max(0, (now - this.start) / SEQUENCE_MS));
  }
}

/** The one shared instance (timeline fires it, the canvas reads it, the UI toggles `reduced`). */
export const flash = new FlashSequence();
