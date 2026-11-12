import Film from "@/components/film/Film";
import { CONTACT_EMAIL, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "An open-source, interactive guide to how firearms work.",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Film />
      {/* Nav sits after the film in the DOM, so it only becomes sticky once the film is over. */}
      <Nav />
      <main id="content">
        <Hero />
        <Spark />
        <Cycle />
        <Actions />
        <Rifling />
        <History />
        <Safety />
        <Faq />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#content" className="wordmark" aria-label={`${SITE_NAME} home`}>
          {SITE_NAME.toUpperCase()}
        </a>
        <nav aria-label="Main">
          <ul>
            <li className="nav-link"><a href="#cycle">Cycle</a></li>
            <li className="nav-link"><a href="#actions">Actions</a></li>
            <li className="nav-link"><a href="#history">History</a></li>
            <li className="nav-link"><a href="#safety">Safety</a></li>
            <li>
              <a href={REPO_URL} className="nav-cta" rel="noopener">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="label">
      <span>{n}</span> {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="hero reveal" aria-labelledby="hero-h">
      <div className="wrap hero-grid">
        <div>
          <h1 id="hero-h" className="display">
            How guns work.
          </h1>
          <p className="lede">The spark, the pressure and the spin, explained.</p>
          <p className="body">
            An open-source guide to what happens inside a firearm in the few milliseconds of a shot: the cartridge, the cycle of
            fire, the main types of action, a short history of ignition, and the rules that keep people safe.
          </p>
          <div className="cta-row">
            <a href="#cycle" className="btn btn-primary">
              Start reading
            </a>
            <a href={REPO_URL} className="btn-text" rel="noopener">
              View on GitHub →
            </a>
          </div>
          <p className="small mono">Open source · MIT · Educational only</p>
        </div>
        <CartridgeArt />
      </div>
    </section>
  );
}

function Spark() {
  const beats = [
    ["Primer.", "The firing pin strikes a small cup of impact-sensitive compound in the base of the cartridge. It makes a hot spark."],
    ["Powder.", "The spark lights the propellant. It burns very fast (it doesn't explode), turning into hot, high-pressure gas."],
    ["Pressure.", "The gas has one way out: it pushes the bullet down the barrel and out of the muzzle."],
  ];
  return (
    <section className="section reveal" aria-labelledby="spark-h">
      <div className="wrap">
        <Label n="01">The cartridge</Label>
        <h2 id="spark-h" className="h2">Four parts, three steps.</h2>
        <p className="body">
          A modern cartridge packs everything for one shot into a single unit: the <b>case</b>, the <b>primer</b>, the{" "}
          <b>propellant</b> and the <b>bullet</b>. The gun only holds it, aims it and sets it off.
        </p>
        <ol className="beats">
          {beats.map(([t, d], i) => (
            <li key={t}>
              <span className="mono step-n">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Cycle() {
  const steps = [
    ["Feed", "A cartridge is moved from the magazine or cylinder into line with the chamber."],
    ["Chamber", "It is pushed fully into the chamber at the rear of the barrel."],
    ["Lock", "The breech closes and stays shut to contain the pressure of firing."],
    ["Fire", "The trigger releases the hammer or striker, which hits the primer."],
    ["Unlock", "After the shot the breech opens, by hand or by the gun's own mechanism."],
    ["Extract", "A small claw pulls the empty case out of the chamber."],
    ["Eject", "The empty case is thrown clear of the gun."],
    ["Cock", "The hammer or striker is reset, ready for the next cycle."],
  ];
  return (
    <section id="cycle" className="section reveal" aria-labelledby="cycle-h">
      <div className="wrap split">
        <div>
          <Label n="02">The cycle of fire</Label>
          <h2 id="cycle-h" className="h2">Eight steps, every shot.</h2>
          <p className="body">
            Every firearm, from an antique revolver to a modern rifle, repeats the same cycle. What changes between designs is who
            does the work: your hand, a spring, or the energy of the shot itself.
          </p>
        </div>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t}>
              <span className="mono step-n">0{i + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Actions() {
  const actions: [string, string, string][] = [
    ["A", "Revolver", "A rotating cylinder holds several rounds. Each trigger pull or cocking turns the next chamber in line with the barrel."],
    ["B", "Bolt action", "The shooter lifts and pulls a bolt handle to extract and eject, then pushes it forward to chamber the next round."],
    ["C", "Lever action", "A lever under the grip swings down and back to cycle the action."],
    ["D", "Pump action", "A sliding fore-end is pulled back and pushed forward to cycle the action."],
    ["E", "Break action", "The barrel hinges open for loading by hand, one or two rounds at a time."],
    ["F", "Semi-automatic", "Energy from each shot (recoil or gas) cycles the action: one trigger pull fires one round and readies the next."],
  ];
  return (
    <section id="actions" className="section reveal" aria-labelledby="actions-h">
      <div className="wrap">
        <Label n="03">Actions</Label>
        <h2 id="actions-h" className="h2">Who does the work?</h2>
        <div className="modes">
          {actions.map(([n, t, d]) => (
            <article className="mode" key={t}>
              <span className="mode-n display">{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rifling() {
  return (
    <section className="section accent reveal" aria-labelledby="rifling-h">
      <div className="wrap split">
        <BarrelArt />
        <div>
          <Label n="04">Rifling</Label>
          <h2 id="rifling-h" className="h2">Why the barrel is grooved.</h2>
          <p className="body">
            Spiral grooves cut inside the barrel grip the bullet and spin it as it travels. The spin keeps it flying point-first,
            like a well-thrown ball, which makes it far more accurate than a smooth barrel.
          </p>
        </div>
      </div>
    </section>
  );
}

function History() {
  const eras: [string, string][] = [
    ["c. 10th century · Fire lance", "Early gunpowder weapons in China: a tube on a spear that shot flame and debris."],
    ["15th century · Matchlock", "A slow-burning cord is lowered into a pan of powder by a lever."],
    ["17th century · Flintlock", "Flint striking steel makes the spark, so no lit cord is needed."],
    ["Early 19th century · Percussion cap", "A small cap of impact-sensitive compound replaces flint and pan."],
    ["Mid 19th century · Metallic cartridge", "Primer, powder and bullet combined in one waterproof case."],
    ["Late 19th century · Smokeless powder", "Cleaner, more powerful propellants replace black powder."],
  ];
  return (
    <section id="history" className="section reveal" aria-labelledby="history-h">
      <div className="wrap">
        <Label n="05">History</Label>
        <h2 id="history-h" className="h2">A thousand years of ignition.</h2>
        <p className="body">Most of firearm history is the story of one problem: how to make the spark reliably.</p>
        <dl className="rules">
          {eras.map(([t, d]) => (
            <div key={t}>
              <dt className="mono">{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Safety() {
  const rules: [string, string][] = [
    ["Rule 1", "Treat every firearm as if it is loaded, even when someone tells you it isn't."],
    ["Rule 2", "Never point a firearm at anything you aren't willing to destroy."],
    ["Rule 3", "Keep your finger off the trigger until you are ready to shoot."],
    ["Rule 4", "Be sure of your target and what is beyond it."],
  ];
  return (
    <section id="safety" className="section reveal" aria-labelledby="safety-h">
      <div className="wrap">
        <Label n="06">Safety</Label>
        <h2 id="safety-h" className="h2">The four rules.</h2>
        <p className="body">
          Taught by instructors worldwide. Store firearms unloaded and locked, follow the laws where you live, and learn hands-on
          only from a qualified instructor.
        </p>
        <dl className="rules">
          {rules.map(([t, d]) => (
            <div key={t}>
              <dt className="mono">{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Faq() {
  const faqs: [string, string][] = [
    ["Is this a how-to guide?", "No. It explains how firearms work in general terms. It doesn't cover building, modifying or buying them."],
    ["What's the difference between a bullet and a cartridge?", "The bullet is only the projectile. The cartridge is the whole round: case, primer, propellant and bullet."],
    ["Why does a gun recoil?", "The gas pushes the bullet forward and the gun backward with equal force. The gun is far heavier, so it moves much less."],
    ["Can I reuse this site?", "Yes. The code is open source under the MIT licence. The 3D pistol model has its own CC BY 4.0 licence (see the footer)."],
  ];
  return (
    <section id="faq" className="section reveal" aria-labelledby="faq-h">
      <div className="wrap narrow">
        <Label n="07">FAQ</Label>
        <h2 id="faq-h" className="h2">FAQ</h2>
        <div className="faq">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contribute() {
  return (
    <section id="contribute" className="section dark" aria-labelledby="contribute-h">
      <div className="wrap narrow">
        <Label n="08">Open source</Label>
        <h2 id="contribute-h" className="display">Help improve it.</h2>
        <p className="body">Spotted a mistake, or drew a better diagram? Open an issue or a pull request.</p>
        <div className="cta-row">
          <a href={REPO_URL} className="btn btn-primary" rel="noopener">
            Contribute on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <ul className="footer-links mono">
          <li>{SITE_NAME}</li>
          <li><a href={REPO_URL} rel="noopener">GitHub</a></li>
          <li><a href={`mailto:${CONTACT_EMAIL}`}>Contact</a></li>
          <li>MIT licence</li>
        </ul>
        <p className="small">Educational content only. Not a guide to building, modifying or acquiring firearms. Follow the laws where you live.</p>
        <p className="small">
          Pistol model:{" "}
          <a href="https://sketchfab.com/TORI106" rel="noopener">
            TORI106
          </a>
          , <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener license">CC BY 4.0</a>, modified (compressed, recoloured).
        </p>
      </div>
    </footer>
  );
}

/* ---------- Line-art diagrams (steel strokes, one red accent each). TODO(asset): replace with finished illustrations. ---------- */

function CartridgeArt() {
  return (
    <svg className="art hero-art" viewBox="0 0 320 400" aria-label="Diagram placeholder: cartridge cutaway" role="img">
      <defs>
        <radialGradient id="heat" cx="50%" cy="85%" r="60%">
          <stop offset="0" stopColor="#FF3B2F" stopOpacity=".35" />
          <stop offset="1" stopColor="#FF3B2F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={60} y={150} width={200} height={240} fill="url(#heat)" />
      {/* bullet */}
      <path d="M120 150 C120 80 160 40 160 40 C160 40 200 80 200 150 Z" className="ln" />
      {/* case */}
      <rect x={112} y={150} width={96} height={210} className="ln" />
      <line x1={112} y1={170} x2={208} y2={170} className="ln faint" />
      {/* powder */}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={124 + ((i * 37) % 72)} cy={190 + ((i * 53) % 140)} r={2} className="fill-steel" />
      ))}
      {/* primer */}
      <rect x={146} y={360} width={28} height={12} className="red-ln" fill="none" />
      <g className="hud mono">
        <text x={214} y={100}>BULLET</text>
        <text x={216} y={250}>PROPELLANT</text>
        <text x={216} y={330}>CASE</text>
        <text x={182} y={392}>PRIMER</text>
      </g>
    </svg>
  );
}

function BarrelArt() {
  return (
    <svg className="art accent-art" viewBox="0 0 320 240" aria-label="Diagram placeholder: rifled barrel" role="img">
      <rect x={20} y={80} width={280} height={80} rx={8} className="ln" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${40 + i * 30} 82 L${70 + i * 30} 158`} className="ln faint" />
      ))}
      <ellipse cx={300} cy={120} rx={14} ry={40} className="ln" />
      <g className="red-ln">
        <path d="M230 120 a24 24 0 1 1 -4 -14" fill="none" />
        <path d="M226 100 l2 8 l-8 -1" fill="none" />
      </g>
      <text x={20} y={200} className="hud mono">GROOVES SPIN THE BULLET</text>
    </svg>
  );
}
