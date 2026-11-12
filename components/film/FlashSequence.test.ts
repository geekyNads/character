import { describe, expect, it } from "vitest";
import { FlashSequence, SEQUENCE_MS } from "./FlashSequence";

/** Sample a run at 1 ms and return the times each flash switches on (rising edges). */
function onsets(seq: FlashSequence, from: number, to: number) {
  const out: number[] = [];
  let prev = false;
  for (let t = from; t <= to; t++) {
    const on = seq.value(t) > 0.5;
    if (on && !prev) out.push(t);
    prev = on;
  }
  return out;
}

const maxInAnySecond = (times: number[]) => Math.max(0, ...times.map((t) => times.filter((u) => u >= t && u < t + 1000).length));

describe("FlashSequence", () => {
  it("plays exactly 3 flashes within 1 second", () => {
    const s = new FlashSequence();
    s.fire(1000);
    const o = onsets(s, 0, 4000);
    expect(o).toEqual([1000, 1450, 1900]);
    expect(o[2] - o[0]).toBeLessThan(1000);
  });

  it("can't run twice in parallel", () => {
    const s = new FlashSequence();
    expect(s.fire(0)).toBe(true);
    expect(s.fire(500)).toBe(false);
    expect(s.fire(SEQUENCE_MS)).toBe(true);
  });

  it("never exceeds 3 flashes in any 1 s window, even when re-fired as fast as allowed", () => {
    const s = new FlashSequence();
    const all: number[] = [];
    let prev = false;
    for (let t = 0; t < 10_000; t++) {
      s.fire(t); // hammer it every ms; the guard decides
      const on = s.value(t) > 0.5;
      if (on && !prev) all.push(t);
      prev = on;
    }
    expect(all.length).toBeGreaterThan(10);
    expect(maxInAnySecond(all)).toBeLessThanOrEqual(3);
  });

  it("reduced flashing is a single soft glow with no strobe", () => {
    const s = new FlashSequence();
    s.reduced = true;
    s.fire(0);
    let prev = 0;
    for (let t = 0; t < SEQUENCE_MS; t++) {
      const v = s.value(t);
      expect(v).toBeLessThanOrEqual(0.55);
      expect(Math.abs(v - prev)).toBeLessThan(0.01); // smooth, no steps
      prev = v;
    }
  });
});
