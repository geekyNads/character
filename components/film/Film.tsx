"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio";
import { detectTier, type Tier } from "@/lib/capability";
import { flash } from "./FlashSequence";
import type Lenis from "lenis";

// 3D chunk is lazy-loaded after first paint; the S1 title is plain HTML.
const FilmCanvas = dynamic(() => import("./FilmCanvas"), { ssr: false });

const FLASH_KEY = "site-reduce-flash";
type Sound = "locked" | "on" | "off";

export default function Film() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [active, setActive] = useState(true);
  const [sound, setSound] = useState<Sound>("locked");
  const [reduceFlash, setReduceFlash] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  const r = {
    section: useRef<HTMLElement>(null),
    title: useRef<HTMLDivElement>(null),
    hint: useRef<HTMLDivElement>(null),
    stage: useRef<HTMLDivElement>(null),
    wipe: useRef<HTMLDivElement>(null),
    bar: useRef<HTMLDivElement>(null),
    l0: useRef<HTMLParagraphElement>(null),
    l1: useRef<HTMLParagraphElement>(null),
    l2: useRef<HTMLParagraphElement>(null),
    l3: useRef<HTMLParagraphElement>(null),
  };

  // Tier + saved preferences.
  useEffect(() => {
    const t = detectTier();
    setTier(t);
    let rf = false;
    try {
      rf = localStorage.getItem(FLASH_KEY) === "1";
    } catch {}
    setReduceFlash(rf);
    flash.reduced = rf || t === "still";
    if (audio.muted) setSound("off");
  }, []);

  // Scroll engine: Lenis + one scrubbed GSAP timeline.
  useEffect(() => {
    if (tier !== "full" && tier !== "lite") return;
    let cleanup = () => {};
    let cancelled = false;
    // GSAP + Lenis load with the film, not with the page.
    Promise.all([import("./timeline"), import("lenis")]).then(([{ createFilmTimeline, gsap, ScrollTrigger }, { default: LenisCtor }]) => {
      if (cancelled) return;
      history.scrollRestoration = "manual";
      const l = new LenisCtor({ anchors: true });
      lenis.current = l;
      l.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const kill = createFilmTimeline({
        section: r.section.current!,
        title: r.title.current!,
        hint: r.hint.current!,
        stage: r.stage.current!,
        wipe: r.wipe.current!,
        bar: r.bar.current!,
        lines: [r.l0.current!, r.l1.current!, r.l2.current!, r.l3.current!],
      });

      // Deep links skip the film: /#safety, /?skip=1.
      const target = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
      if (target) l.scrollTo(target, { immediate: true });
      else if (new URLSearchParams(location.search).has("skip")) l.scrollTo("#content", { immediate: true });
      else l.scrollTo(0, { immediate: true, force: true });

      let resizeTimer = 0;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      };
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      addEventListener("resize", onResize);
      const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
      io.observe(r.section.current!);

      cleanup = () => {
        kill();
        gsap.ticker.remove(raf);
        l.destroy();
        lenis.current = null;
        io.disconnect();
        removeEventListener("resize", onResize);
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  // First user gesture unlocks audio and starts the drone (unless the visitor muted before).
  useEffect(() => {
    const unlock = () => {
      if (audio.muted || audio.running) return;
      audio.unlock().then(() => setSound("on"));
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    evs.forEach((e) => addEventListener(e, unlock, { once: true, passive: true }));
    return () => evs.forEach((e) => removeEventListener(e, unlock));
  }, []);

  const toggleSound = async () => {
    if (sound === "on") {
      audio.setMuted(true);
      setSound("off");
      return;
    }
    audio.setMuted(false);
    await audio.unlock();
    setSound("on");
  };

  const toggleFlash = () => {
    const v = !reduceFlash;
    setReduceFlash(v);
    flash.reduced = v || tier === "still";
    try {
      localStorage.setItem(FLASH_KEY, v ? "1" : "0");
    } catch {}
  };

  const skip = (e: React.MouseEvent) => {
    if (!lenis.current) return; // native anchor jump
    e.preventDefault();
    lenis.current.scrollTo("#content", { duration: 1.4 });
  };

  const playing = tier === "full" || tier === "lite";
  const soundLabel = sound === "locked" ? "Sound off — tap to enable" : sound === "on" ? "Sound on" : "Sound off";

  return (
    <section ref={r.section} className={`film film-${tier ?? "pending"}`} aria-label="Intro film">
      <div className="film-stage">
        <a href="#content" className="film-skip mono" onClick={skip}>
          {playing || tier === null ? "Skip intro ↓" : "Continue ↓"}
        </a>
        <div ref={r.stage} className="film-canvas" aria-hidden="true">
          {playing && <FilmCanvas lite={tier === "lite"} active={active} />}
          {tier === "still" && <FilmCanvas lite active={false} still />}
          {/* TODO(asset): tier "video" → a <video> of the film for browsers without WebGL. Until then: title card. */}
        </div>
        <p className="sr-only">
          Intro film: a pistol is revealed under a spotlight, the camera circles to the muzzle, and it fires.
        </p>

        <div ref={r.title} className="film-title">
          <p className="film-word">SITE NAME</p>
          <p className="film-sub mono">HOW GUNS WORK.</p>
        </div>
        <div ref={r.hint} className="film-hint mono" aria-hidden="true">
          <span />
          Scroll
        </div>
        <p ref={r.l0} className="film-line film-line-corner mono">Every shot starts with a spark.</p>
        <p ref={r.l1} className="film-line film-line-corner mono">It&rsquo;s over in milliseconds.</p>
        <p ref={r.l2} className="film-line film-line-center">Primer. Powder. Pressure.</p>
        <p ref={r.l3} className="film-line film-line-center">Here&rsquo;s how it works.</p>

        {playing && (
          <div className="film-controls mono">
            <button type="button" onClick={toggleSound} aria-pressed={sound === "on"}>
              <SoundIcon on={sound === "on"} /> {soundLabel}
            </button>
            <p>Contains brief flashing light.</p>
            <button type="button" onClick={toggleFlash} aria-pressed={reduceFlash}>
              Reduce flashing: {reduceFlash ? "on" : "off"}
            </button>
          </div>
        )}
        <div ref={r.wipe} className="film-wipe" />
        <div ref={r.bar} className="film-bar" />
      </div>
    </section>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="none" />
      {on ? <path d="M11.5 5.5a3.5 3.5 0 010 5M13.5 3.5a6.5 6.5 0 010 9" /> : <path d="M11 6l4 4M15 6l-4 4" />}
    </svg>
  );
}
