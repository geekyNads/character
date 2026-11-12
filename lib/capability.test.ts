import { expect, it } from "vitest";
import { pickTier } from "./capability";

const base = { reducedMotion: false, webgl2: true, mobile: false, saveData: false, lowCores: false };

it("picks tiers in priority order", () => {
  expect(pickTier(base)).toBe("full");
  expect(pickTier({ ...base, mobile: true })).toBe("lite");
  expect(pickTier({ ...base, saveData: true })).toBe("lite");
  expect(pickTier({ ...base, webgl2: false, mobile: true })).toBe("video");
  expect(pickTier({ ...base, webgl2: false, reducedMotion: true })).toBe("still");
});
