import { Suspense, lazy } from "react";
import { Github, Mail, Linkedin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CONFIG, SPLINE_SCENE } from "../data/content";
import { SplineScene } from "./ui/splite";
import { Spotlight } from "./ui/spotlight";
import { Card } from "./ui/card";
import { containerStyle } from "./SectionHead";
import { useInView } from "../lib/useInView";

// Lazy so `three` (only used by the hills) is split into its own chunk and
// never touches the initial page load.
const GLSLHills = lazy(() => import("./ui/glsl-hills"));

const strip = (u: string) => u.replace(/^https?:\/\//, "");

export default function Contact() {
  const { t } = useApp();
  const { ref, inView } = useInView<HTMLElement>("300px");

  const links = [
    { icon: <Github size={20} />, label: "GitHub", value: strip(CONFIG.github), href: CONFIG.github, ext: true },
    { icon: <Mail size={20} />, label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}`, ext: false },
    { icon: <Linkedin size={20} />, label: "LinkedIn", value: strip(CONFIG.linkedin), href: CONFIG.linkedin, ext: true },
  ];

  return (
    <section ref={ref} id="contact" style={{ position: "relative", zIndex: 1, padding: "clamp(72px,10vw,120px) 0", overflow: "hidden", minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* GLSL animated hills background — mounted only when the section is near view */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {inView && (
          <Suspense fallback={null}>
            <GLSLHills speed={0.5} />
          </Suspense>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(90deg, rgba(12,15,23,.85) 0%, rgba(12,15,23,.4) 45%, rgba(12,15,23,.05) 100%), linear-gradient(180deg, #0c0f17 0%, transparent 20%, transparent 100%)" }} />

      <div style={{ ...containerStyle, position: "relative", zIndex: 2 }}>
        <div data-reveal style={{ maxWidth: 640, marginBottom: 44 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ color: "#5b6480" }}>05</span>{t.contact.tag}
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem,4.5vw,2.85rem)", letterSpacing: "-1px", lineHeight: 1.06, color: "#eef2fb" }}>{t.contact.title}</h2>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 52, alignItems: "stretch" }}>
          {/* Left: intro + contact links */}
          <div data-reveal style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ color: "#c1c9de", fontSize: "1.08rem", marginBottom: 28 }}>{t.contact.intro}</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.ext ? { target: "_blank", rel: "noopener" } : {})}
                  className="contact-link"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,.1)", color: "#eef2fb", transition: "padding .2s, color .2s" }}
                >
                  <span style={{ flexShrink: 0, display: "inline-flex", color: "currentColor" }}>{l.icon}</span>
                  <span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".78rem", color: "#8a93ab", display: "block" }}>{l.label}</span>
                    <span style={{ fontWeight: 500 }}>{l.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Spline robot card (replaces the old form) */}
          <div data-reveal style={{ flex: "1 1 420px", minWidth: 0 }}>
            <Card className="w-full relative overflow-hidden border-0" style={{ height: 460, background: "rgba(7,9,14,.72)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.1)" }}>
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 from-white via-white/60 to-transparent" />
              <div style={{ display: "flex", height: "100%", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 220px", padding: 32, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 1, color: "var(--accent2)", marginBottom: 12 }}>{t.contact.robotKicker}</span>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.1rem)", lineHeight: 1.1, background: "linear-gradient(to bottom, #fafafa, #a3a3a3)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{t.contact.robotTitle}</h3>
                  <p style={{ marginTop: 16, color: "#c1c9de", maxWidth: 320, fontSize: ".98rem" }}>{t.contact.robotDesc}</p>
                  <a href={`mailto:${CONFIG.email}`} style={{ marginTop: 22, alignSelf: "flex-start", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 22px", borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)", boxShadow: "0 8px 30px var(--glow-a)" }}>{t.contact.robotKicker} →</a>
                </div>
                <div style={{ flex: "1 1 220px", position: "relative", minHeight: 240 }}>
                  {inView && <SplineScene scene={SPLINE_SCENE} className="w-full h-full" />}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
