import React, { useEffect, useState } from "react";

const SECTIONS = [
    { id: "hero", label: "Intro" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Works" },
    { id: "experience", label: "Journey" },
    { id: "contact", label: "Contact" }
];

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight <= 0 ? 0 : (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="scroll-progress-bar"
            style={{ width: `${progress}%` }}
        />
    );
}

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px", // Trigger active state when section takes center screen
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        SECTIONS.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => {
            SECTIONS.forEach((sec) => {
                const el = document.getElementById(sec.id);
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <nav className="navbar glass-card">
            <div className="nav-logo">
                <a href="#hero">LIKHIT<span>.</span></a>
            </div>
            <ul className="nav-links">
                {SECTIONS.map((sec) => (
                    <li key={sec.id}>
                        <a
                            href={`#${sec.id}`}
                            className={activeSection === sec.id ? "active" : ""}
                        >
                            {sec.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
