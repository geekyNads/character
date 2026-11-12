"use client";

import { useEffect } from "react";

/**
 * Page motion: hero intro, scroll reveals, drifting thermal heat and smooth scrolling.
 * GSAP + Lenis load after first paint. With reduced motion the inline script never adds `.anim`,
 * so nothing here runs and the page is static and fully visible.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("anim")) return;
    let cleanup = () => {};
    let alive = true;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // In-page links glide with Lenis instead of jumping.
      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
        const id = a?.getAttribute("href");
        const target = id && id.length > 1 ? document.querySelector(id) : null;
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
        history.replaceState(null, "", id);
      };
      document.addEventListener("click", onClick);

      const ctx = gsap.context(() => {
        gsap.set("[data-intro], [data-reveal]", { opacity: 0 });
        root.classList.add("anim-ready");

        // Hero: the image wipes up, the headline rises line by line, the rest settles in.
        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
        tl.set(".b-image, .b-title", { opacity: 1 }, 0)
          .fromTo(".b-image", { clipPath: "inset(100% 0% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.5 }, 0)
          .from(".b-image .ph", { scale: 1.25, duration: 2 }, 0)
          .fromTo(".line > span", { yPercent: 115 }, { yPercent: 0, stagger: 0.1 }, 0.2)
          .from(".reticle", { scale: 0.3, rotate: -90, opacity: 0, duration: 1.4 }, 0.7)
          .fromTo("[data-intro]:not(.b-image):not(.b-title)", { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, 0.5);

        // The crosshair follows the pointer over the hero image, like aiming.
        const img = document.querySelector<HTMLElement>(".b-image");
        const rx = gsap.quickTo(".reticle", "x", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(".reticle", "y", { duration: 0.6, ease: "power3" });
        const aim = (e: PointerEvent) => {
          if (!img) return;
          const r = img.getBoundingClientRect();
          rx((e.clientX - r.left - r.width / 2) * 0.35);
          ry((e.clientY - r.top - r.height * 0.46) * 0.35);
        };
        const rest = () => {
          rx(0);
          ry(0);
        };
        img?.addEventListener("pointermove", aim);
        img?.addEventListener("pointerleave", rest);

        // Hero image drifts slower than the page.
        gsap.to(".b-image .ph", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        // Thermal heat drifts slowly behind everything.
        gsap.to(".heat", { x: "random(-140, 140)", y: "random(-90, 90)", duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true });

        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, duration: 1.1, ease: "expo.out" }),
        });
        gsap.from(".heatbar-track", { scaleX: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".heatbar", start: "top 85%" } });

        return () => {
          img?.removeEventListener("pointermove", aim);
          img?.removeEventListener("pointerleave", rest);
        };
      });

      cleanup = () => {
        ctx.revert();
        root.classList.remove("anim-ready"); // hand back to the CSS failsafe
        gsap.ticker.remove(tick);
        lenis.destroy();
        document.removeEventListener("click", onClick);
      };
    })();

    return () => {
      alive = false;
      cleanup();
    };
  }, []);
  return null;
}
