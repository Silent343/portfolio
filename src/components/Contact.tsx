import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Box, Github, Linkedin, Mail, Pause } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CONFIG, SPLINE_SCENE } from "../data/content";
import { containerStyle } from "./SectionHead";
import { Card } from "./ui/card";
import { SplineScene } from "./ui/splite";

const strip = (url: string) => url.replace(/^https?:\/\//, "");

export default function Contact() {
  const { t } = useApp();
  const ref = useRef<HTMLElement>(null);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) setShow3D(false);
        })
      : null;
    const onVisibilityChange = () => {
      if (document.hidden) setShow3D(false);
    };

    observer?.observe(section);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const links = [
    { icon: <Github size={20} />, label: "GitHub", value: strip(CONFIG.github), href: CONFIG.github, ext: true },
    { icon: <Mail size={20} />, label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}`, ext: false },
    { icon: <Linkedin size={20} />, label: "LinkedIn", value: strip(CONFIG.linkedin), href: CONFIG.linkedin, ext: true },
  ];

  return (
    <section ref={ref} id="contact" className="contact-section">
      <div className="contact-ambient" aria-hidden="true" />

      <div style={{ ...containerStyle, position: "relative", zIndex: 2 }}>
        <div data-reveal style={{ maxWidth: 640, marginBottom: 44 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ color: "#5b6480" }}>05</span>{t.contact.tag}
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem,4.5vw,2.85rem)", letterSpacing: "-1px", lineHeight: 1.06, color: "#eef2fb" }}>
            {t.contact.title}
          </h2>
        </div>

        <div className="contact-layout">
          <div data-reveal className="contact-details">
            <p className="contact-intro">{t.contact.intro}</p>
            <div className="contact-links">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="contact-link"
                >
                  <span className="contact-link-icon">{link.icon}</span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">{link.label}</span>
                    <span className="contact-link-value">{link.value}</span>
                  </span>
                  <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div data-reveal className="contact-showcase-wrap">
            <Card className="contact-showcase">
              <div className="contact-spline" aria-hidden="true">
                {show3D && <SplineScene scene={SPLINE_SCENE} className="w-full h-full" />}
              </div>
              <div className="contact-showcase-shade" aria-hidden="true" />

              {show3D ? (
                <button type="button" className="contact-3d-pause" onClick={() => setShow3D(false)}>
                  <Pause size={16} aria-hidden="true" />{t.contact.pause3D}
                </button>
              ) : (
                <button type="button" className="contact-3d-trigger" onClick={() => setShow3D(true)}>
                  <span className="contact-3d-icon"><Box size={44} strokeWidth={1.4} aria-hidden="true" /></span>
                  <span>{t.contact.show3D}</span>
                </button>
              )}

              <div className="contact-showcase-copy">
                <span className="contact-kicker">{t.contact.robotKicker}</span>
                <h3>{t.contact.robotTitle}</h3>
                <p>{t.contact.robotDesc}</p>
                <a href={`mailto:${CONFIG.email}`} className="contact-cta">
                  {t.contact.robotKicker}<ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
