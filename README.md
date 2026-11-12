# Site Name

An open-source, interactive guide to how firearms work. A scroll-driven 3D intro (a pistol revealed under a spotlight, then fired) leads into plain-language sections on the cartridge, the cycle of fire, the main action types, rifling, a short history of ignition, and the four universal safety rules.

Educational content only. It does not cover building, modifying or acquiring firearms.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # flash-cap and device-tier tests
npm run build
```

Built with Next.js, React Three Fiber, GSAP and Lenis. The 3D chunk loads after first paint. There's no sound before a tap, flashing is capped at 3 per second (with a "reduce flashing" switch), and reduced-motion visitors get a single still frame. Deep link `/?skip=1` skips the intro.

## Placeholders to replace

- `lib/site.ts`: site name, repository URL and contact email
- `components/film/Film.tsx`: the intro title card
- `LICENSE`: copyright holder
- The line-art diagrams in `app/page.tsx` are placeholders for finished illustrations

## Credits

Pistol model by [TORI106](https://sketchfab.com/TORI106), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Modified: compressed (meshopt, 1K WebP) and recoloured.

## Licence

Code: MIT, see [LICENSE](LICENSE). The pistol model keeps its own CC BY 4.0 licence.
