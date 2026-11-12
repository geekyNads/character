import { Motion } from "@/components/Motion";
import { CONTACT_EMAIL, REPO_URL, SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Motion />
      <Nav />
      <main id="content">
        <Hero />
        <Cycle />
        <Cartridge />
        <Actions />
        <History />
        <Safety />
        <Faq />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}

/** Thermal placeholder. TODO(asset): replace each with a diagram or illustration. */
function Ph({ label, cool }: { label: string; cool?: boolean }) {
  return (
    <div className={cool ? "ph cool" : "ph"} role="img" aria-label={`Placeholder image: ${label}`}>
      <div className="ph-heat" />
      <span className="ph-label">{label}</span>
    </div>
  );
}

function Label({ n, children }: { n?: string; children: React.ReactNode }) {
  return (
    <p className="label">
      <span className="dot" />
      {n && <>{n} · </>}
      {children}
    </p>
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
            <li className="nav-link"><a href="#cartridge">Cartridge</a></li>
            <li className="nav-link"><a href="#actions">Actions</a></li>
            <li className="nav-link"><a href="#history">History</a></li>
            <li className="nav-link"><a href="#safety">Safety</a></li>
            <li>
              <a href={REPO_URL} className="btn btn-primary" rel="noopener">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Reticle() {
  return (
    <svg className="reticle" viewBox="0 0 120 120" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M60 14 A46 46 0 0 1 106 60" />
        <path d="M106 60 A46 46 0 0 1 60 106" opacity=".5" />
        <path d="M60 106 A46 46 0 0 1 14 60" />
        <path d="M14 60 A46 46 0 0 1 60 14" opacity=".5" />
        <path d="M60 0v12M60 108v12M0 60h12M108 60h12" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="3.5" fill="#ff6347" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="heat" style={{ left: "-12vw", top: "-8vw" }} aria-hidden="true" />
      <div className="wrap bento">
        <div className="b b-title" data-intro>
          <Label>Open source · educational guide</Label>
          <h1 id="hero-h" className="display">
            <span className="line"><span>How</span></span>
            <span className="line"><span>guns</span></span>
            <span className="line"><span>work.</span></span>
          </h1>
          <p className="sub">The mechanics, history and safety of firearms, explained visually.</p>
        </div>

        <div className="b b-image" data-intro>
          <Ph label="Cutaway illustration · placeholder" />
          <Reticle />
        </div>

        <div className="b b-media" data-intro>
          <div className="play" aria-hidden="true">
            <span>▶</span>
          </div>
          <Ph label="Explainer video · placeholder" cool />
        </div>

        <p className="b b-copy" data-intro>
          From the spark of a primer to the spin of rifling: a plain-language guide to what happens inside a firearm in the few
          milliseconds of a shot, and the rules that keep people safe around them.
        </p>

        <a href="#cartridge" className="b b-card" data-intro>
          <Ph label="Cartridge diagram" cool />
          <p>Start with the cartridge →</p>
        </a>

        <p className="b b-text" data-intro>
          <strong>Open source · MIT</strong>
          Educational only. Corrections and diagrams welcome on GitHub.
        </p>

        <a href="#cycle" className="b b-cta" data-intro>
          Start reading
          <span className="arrow" aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function Cycle() {
  const steps = [
    ["Feed", "A cartridge is moved from the magazine or cylinder into line with the chamber."],
    ["Chamber", "The cartridge is pushed fully into the chamber at the rear of the barrel."],
    ["Lock", "The breech is closed and held shut so it can contain the pressure of firing."],
    ["Fire", "The trigger releases the hammer or striker, which hits the primer."],
    ["Unlock", "After the shot, the breech is opened, by hand or by the gun's own mechanism."],
    ["Extract", "A small claw pulls the empty case out of the chamber."],
    ["Eject", "The empty case is thrown clear of the gun."],
    ["Cock", "The hammer or striker is reset, ready for the next cycle."],
  ];
  return (
    <section id="cycle" className="section alt" aria-labelledby="cycle-h">
      <div className="wrap">
        <div className="head" data-reveal>
          <div>
            <Label n="01">The cycle of fire</Label>
            <h2 id="cycle-h" className="h2">Eight steps, every shot.</h2>
          </div>
          <p className="lede">
            Every firearm, from an antique revolver to a modern rifle, repeats the same basic cycle. What changes between designs is
            who does the work: your hand, a spring, or the energy of the shot itself.
          </p>
        </div>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t} data-reveal>
              <span className="n">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Cartridge() {
  const parts: [string, string][] = [
    ["Case", "The brass or steel shell that holds everything together and seals the chamber when fired."],
    ["Primer", "A small cup of impact-sensitive compound in the base. Struck, it makes a hot spark."],
    ["Propellant", "Powder that burns very fast (it doesn't explode), turning into hot, high-pressure gas."],
    ["Projectile", "The bullet, pushed down the barrel by the expanding gas."],
  ];
  const phases = ["Primer strike", "Ignition", "Peak pressure", "In the barrel", "Muzzle exit"];
  return (
    <section id="cartridge" className="section" aria-labelledby="cartridge-h">
      <div className="heat" style={{ right: "-14vw", top: "10%" }} aria-hidden="true" />
      <div className="wrap">
        <div className="head" data-reveal>
          <div>
            <Label n="02">The cartridge</Label>
            <h2 id="cartridge-h" className="h2">Four parts, one package.</h2>
          </div>
          <p className="lede">
            A modern cartridge puts everything needed for one shot into a single unit. The gun itself only aims it, holds it and
            sets it off.
          </p>
        </div>
        <div className="modes">
          <article className="mode" data-reveal>
            <Ph label="Cartridge cutaway · placeholder" />
            <div className="mode-body">
              <p className="label">Anatomy</p>
              <h3>What&rsquo;s inside</h3>
              <ul className="chips">
                {parts.map(([t]) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
          <article className="mode" data-reveal>
            <div className="mode-body">
              {parts.map(([t, d]) => (
                <div key={t} style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 20, margin: "0 0 6px" }}>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="heatbar" data-reveal>
          <p className="label">A shot, in a few milliseconds</p>
          <div className="heatbar-track" />
          <div className="heatbar-scale">
            {phases.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="small" style={{ marginTop: 14 }}>
            Grooves inside the barrel, called rifling, spin the bullet as it travels. The spin keeps it stable in flight, like a
            well-thrown ball.
          </p>
        </div>
      </div>
    </section>
  );
}

function Actions() {
  const actions: [string, string][] = [
    ["Revolver", "A rotating cylinder holds several rounds. Each trigger pull or cocking turns the next chamber in line with the barrel."],
    ["Bolt action", "The shooter lifts and pulls a bolt handle to extract and eject, then pushes it forward to chamber the next round."],
    ["Lever action", "A lever under the grip is swung down and back to cycle the action."],
    ["Pump action", "A sliding fore-end is pulled back and pushed forward to cycle the action."],
    ["Break action", "The barrel hinges open for loading by hand, one or two rounds at a time."],
    ["Semi-automatic", "Energy from each shot cycles the action, so one trigger pull fires one round and readies the next."],
  ];
  return (
    <section id="actions" className="section alt" aria-labelledby="actions-h">
      <div className="wrap">
        <div className="head" data-reveal>
          <div>
            <Label n="03">Actions</Label>
            <h2 id="actions-h" className="h2">Who does the work?</h2>
          </div>
          <p className="lede">The &ldquo;action&rdquo; is the mechanism that loads, fires and unloads. These are the common families.</p>
        </div>
        <div className="store">
          <article className="item feature" data-reveal>
            <Ph label="Action comparison · placeholder" />
            <h3>Manual vs self-loading</h3>
            <p>
              In a manual action the shooter&rsquo;s hand runs the cycle between shots. In a self-loading action, part of the energy
              of the shot (recoil or gas) does it instead.
            </p>
            <span className="kind">Overview</span>
          </article>
          {actions.map(([t, d]) => (
            <article className="item" key={t} data-reveal>
              <Ph label={`${t} · placeholder`} cool />
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="kind">Action</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function History() {
  const eras: [string, string, string][] = [
    ["c. 10th century", "Fire lance", "Early gunpowder weapons in China: a tube on a spear that shot flame and debris."],
    ["15th century", "Matchlock", "A slow-burning cord is lowered into a pan of powder by a lever."],
    ["17th century", "Flintlock", "Flint striking steel makes the spark, so no lit cord is needed."],
    ["Early 19th century", "Percussion cap", "A small cap of impact-sensitive compound replaces flint and pan."],
    ["Mid 19th century", "Metallic cartridge", "Primer, powder and bullet combined in one waterproof case."],
    ["Late 19th century", "Smokeless powder", "Cleaner, more powerful propellants replace black powder."],
  ];
  return (
    <section id="history" className="section" aria-labelledby="history-h">
      <div className="wrap">
        <div className="head" data-reveal>
          <div>
            <Label n="04">History</Label>
            <h2 id="history-h" className="h2">A thousand years of ignition.</h2>
          </div>
          <p className="lede">Most of firearm history is the story of one problem: how to make the spark reliably.</p>
        </div>
        <div className="safety">
          {eras.map(([when, t, d]) => (
            <div key={t} data-reveal>
              <p className="label" style={{ marginBottom: 10 }}>{when}</p>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const rules: [string, string][] = [
    ["Treat every firearm as loaded", "Always, even when someone tells you it's empty."],
    ["Never point at anything you aren't willing to destroy", "Keep the muzzle in a safe direction at all times."],
    ["Keep your finger off the trigger", "Rest it outside the trigger guard until you are ready to shoot."],
    ["Know your target and what's beyond it", "A bullet can travel far past what you are aiming at."],
  ];
  return (
    <section id="safety" className="section alt" aria-labelledby="safety-h">
      <div className="wrap">
        <div className="head" data-reveal>
          <div>
            <Label n="05">Safety</Label>
            <h2 id="safety-h" className="h2">The four rules.</h2>
          </div>
          <p className="lede">
            Taught by instructors worldwide. Store firearms unloaded and locked, follow the laws where you live, and learn hands-on
            only from a qualified instructor.
          </p>
        </div>
        <div className="safety two">
          {rules.map(([t, d], i) => (
            <div key={t} data-reveal>
              <p className="label" style={{ marginBottom: 10 }}>Rule 0{i + 1}</p>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const faqs: [string, string][] = [
    ["Is this a how-to guide?", "No. It explains how firearms work in general terms. It doesn't cover building, modifying or buying them."],
    ["Why is the barrel grooved?", "Rifling spins the bullet so it flies point-first and stays stable, which makes it far more accurate."],
    ["What's the difference between a bullet and a cartridge?", "The bullet is only the projectile. The cartridge is the whole round: case, primer, propellant and bullet."],
    ["Can I use these diagrams?", "Yes. The site is open source under the MIT licence. Check each image's own licence once real diagrams are added."],
  ];
  return (
    <section id="faq" className="section" aria-labelledby="faq-h">
      <div className="wrap narrow">
        <Label n="06">FAQ</Label>
        <h2 id="faq-h" className="h2">FAQ</h2>
        <div className="faq" data-reveal>
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
      <div className="heat" style={{ left: "40%", top: "-20%" }} aria-hidden="true" />
      <div className="wrap narrow">
        <Label n="07">Open source</Label>
        <h2 id="contribute-h" className="display">Help improve it.</h2>
        <p className="lede">
          Spotted a mistake, or drew a better diagram? Open an issue or a pull request. Everything here is MIT licensed.
        </p>
        <p style={{ marginTop: 28 }}>
          <a href={REPO_URL} className="btn btn-primary" rel="noopener">
            Contribute on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <ul className="footer-links">
          <li>{SITE_NAME}</li>
          <li><a href={REPO_URL} rel="noopener">GitHub</a></li>
          <li><a href={`mailto:${CONTACT_EMAIL}`}>Contact</a></li>
          <li>MIT licence</li>
        </ul>
        <p className="small">
          Educational content only. Not a guide to building, modifying or acquiring firearms. Follow the laws where you live. Images
          are placeholders.
        </p>
      </div>
    </footer>
  );
}
