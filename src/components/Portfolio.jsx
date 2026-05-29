import React from "react";

export default function Portfolio() {
    return (
        <div className="portfolio-container">
            {/* SECTION 1: HERO */}
            <section id="hero" className="section hero-section">
                <div className="hero-content">
                    <span className="badge">Intro</span>
                    <p className="hero-greeting">Hello, my name is</p>
                    <h1 className="hero-title">Likhit Naidu.</h1>
                    
                    <div className="hero-taglines">
                        <span className="tagline">// I build products.</span>
                        <span className="tagline">// I ship fast.</span>
                        <span className="tagline">// I design with code.</span>
                    </div>

                    <p className="hero-subtitle">
                        Computer Science Engineering student focused on software development and applied AI. I build projects in Python and JavaScript while actively developing strong foundations in data structures, algorithms, and system design through practical work.
                    </p>

                    <div className="hero-actions">
                        <a href="#projects" className="cta-btn primary">View Projects</a>
                        <a href="#contact" className="cta-btn secondary">Get In Touch</a>
                    </div>

                    {/* Identity JSON Terminal Card */}
                    <div className="terminal-window glass-card">
                        <div className="terminal-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <span className="terminal-title">identity.json</span>
                        </div>
                        <div className="terminal-body">
                            <pre>
{`{
  "name": "Likhit Naidu",
  "role": "Product-minded Frontend Engineer",
  "focus": "AI-assisted builder | Learning LLMs",
  "location": "India 🇮🇳",
  "status": "Open to opportunities"
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: ABOUT */}
            <section id="about" className="section about-section">
                <div className="container">
                    <div className="grid-2col">
                        <div className="content-card glass-card">
                            <span className="section-label">01 / Profile</span>
                            <h2 className="section-title">About Me</h2>
                            <p className="card-text font-accent">
                                I'm not your typical developer. While others debate tabs vs spaces, I'm busy building products that actually solve problems. My journey started with curiosity, evolved through countless late nights of debugging, and led me to where I am now: a frontend engineer with a product mindset.
                            </p>
                            <p className="card-text">
                                Currently pursuing my CSE degree, I spend most of my time exploring the intersection of AI and web development. I believe the best interfaces are invisible. That's what I strive to build.
                            </p>
                            <p className="card-text">
                                When I'm not coding, you'll find me exploring new tech, reading about system design, or experimenting with LLMs to enhance my development workflow. I'm always looking for opportunities to work on products that matter.
                            </p>

                            <div className="tech-tags-header">Technologies I work with:</div>
                            <div className="tech-tags">
                                <span>JavaScript (ES6+)</span>
                                <span>TypeScript</span>
                                <span>React</span>
                                <span>Python</span>
                                <span>Llama3</span>
                                <span>TailwindCSS</span>
                            </div>

                            <div className="profile-attributes">
                                <div className="attribute-badge">
                                    <span className="attr-title">Clean Code</span>
                                    <span className="attr-desc">Obsessed</span>
                                </div>
                                <div className="attribute-badge">
                                    <span className="attr-title">Ship Speed</span>
                                    <span className="attr-desc">Fast AF</span>
                                </div>
                                <div className="attribute-badge">
                                    <span className="attr-title">AI/LLM</span>
                                    <span className="attr-desc">Learning</span>
                                </div>
                                <div className="attribute-badge">
                                    <span className="attr-title">Available</span>
                                    <span className="attr-desc">Remote</span>
                                </div>
                            </div>
                        </div>
                        {/* Right column remains empty to showcase the 3D model */}
                        <div className="empty-spacer"></div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: SKILLS */}
            <section id="skills" className="section skills-section">
                <div className="container">
                    <div className="grid-2col">
                        {/* Left column remains empty for the zoomed 3D model */}
                        <div className="empty-spacer"></div>
                        <div className="content-card glass-card">
                            <span className="section-label">02 / Stack</span>
                            <h2 className="section-title">Skills & Stack</h2>
                            
                            <div className="skills-container">
                                <div className="skill-category">
                                    <h4>Frontend</h4>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>React</span><span>60%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "60%"}}></div></div>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>TypeScript</span><span>25%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "25%"}}></div></div>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>JavaScript</span><span>65%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "65%"}}></div></div>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>TailwindCSS</span><span>85%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "85%"}}></div></div>
                                    </div>
                                </div>

                                <div className="skill-category">
                                    <h4>AI & Emerging</h4>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>Prompt Engineering</span><span>75%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "75%"}}></div></div>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>LLM Integration</span><span>8%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "8%"}}></div></div>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-info"><span>Python</span><span>65%</span></div>
                                        <div className="bar-bg"><div className="bar-fill" style={{width: "65%"}}></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="additional-tags-header">Other Strengths:</div>
                            <div className="additional-tags">
                                <span>Problem Solver</span>
                                <span>Quick Learner</span>
                                <span>Team Player</span>
                                <span>Detail Oriented</span>
                                <span>Product Thinking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: PROJECTS */}
            <section id="projects" className="section projects-section">
                <div className="container">
                    <span className="section-label text-center">03 / Works</span>
                    <h2 className="section-title text-center" style={{marginBottom: "3rem"}}>Featured Projects</h2>
                    
                    <div className="projects-grid">
                        <div className="project-card glass-card">
                            <span className="proj-badge">Featured Project</span>
                            <h3>Recylytix</h3>
                            <p className="proj-desc">
                                AI-driven recycling insights platform that helps communities track and improve their recycling habits using machine learning.
                            </p>
                            <div className="proj-tech">
                                <span>React</span>
                                <span>Python</span>
                                <span>TensorFlow</span>
                                <span>Node.js</span>
                            </div>
                            <a href="#recylytix" className="proj-link">View Details &rarr;</a>
                        </div>

                        <div className="project-card glass-card">
                            <span className="proj-badge">Featured Project</span>
                            <h3>Live Map Navigator</h3>
                            <p className="proj-desc">
                                Real-time navigation frontend with interactive maps, route optimization, and live traffic updates.
                            </p>
                            <div className="proj-tech">
                                <span>React</span>
                                <span>Mapbox GL</span>
                                <span>WebSocket</span>
                                <span>Redux</span>
                            </div>
                            <a href="#map-nav" className="proj-link">View Details &rarr;</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: EXPERIENCE */}
            <section id="experience" className="section experience-section">
                <div className="container">
                    <span className="section-label text-center">04 / Journey</span>
                    <h2 className="section-title text-center" style={{marginBottom: "3rem"}}>Experience & Education</h2>
                    
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-date">2022 - 2024</div>
                            <div className="timeline-content glass-card">
                                <h3>Road to CSE Student</h3>
                                <h4 className="timeline-company">Narayana</h4>
                                <p>Pursuing Computer Science & Engineering. Building a strong foundation in Mathematics, logic, and core computing sciences.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-date">2023 - Present</div>
                            <div className="timeline-content glass-card">
                                <h3>Web Development Track</h3>
                                <h4 className="timeline-company">Self-Learning</h4>
                                <p>Mastered modern frontend development with React, TypeScript, and modern ecosystem tools (Vite, Vercel, Figma). Built multiple production-ready interactive web projects.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-date">2024 - Present</div>
                            <div className="timeline-content glass-card">
                                <h3>AI & LLM Exploration</h3>
                                <h4 className="timeline-company">Research & Projects</h4>
                                <p>Diving deep into AI-assisted development, prompt engineering methodologies, and building web utilities leveraging large language models (such as Llama3).</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-date">2025</div>
                            <div className="timeline-content glass-card">
                                <h3>UDAYA 1.0 Hackathon</h3>
                                <h4 className="timeline-company">DSCE</h4>
                                <p>Designed and built an educational platform in a fast-paced hackathon environment, implementing responsive layouts and live interaction features.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: CONTACT */}
            <section id="contact" className="section contact-section">
                <div className="container">
                    <div className="contact-box glass-card text-center">
                        <span className="section-label">05 / What's Next?</span>
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="contact-subtitle">
                            I am currently open to new opportunities. Whether you have an interesting product idea, a question, or just want to connect, feel free to drop a message.
                        </p>
                        
                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <input type="text" placeholder="Your Name" defaultValue="Likhit naidu" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Your Email" defaultValue="m.likhitwork@gmail.com" required />
                            </div>
                            <div className="form-group">
                                <textarea rows="4" placeholder="Your Message..." required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Send Message</button>
                        </form>

                        <div className="direct-info">
                            <p>Direct: <strong>m.likhitwork@gmail.com</strong></p>
                            <p>Location: <strong>India 🇮🇳</strong></p>
                        </div>

                        <div className="social-links">
                            <a href="https://github.com/likhitnaidu" target="_blank" rel="noreferrer" className="social-link">GitHub (@likhitnaidu)</a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link">LinkedIn (Likhit Naidu)</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
