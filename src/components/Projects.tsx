import { ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CONFIG, PROJECTS } from "../data/content";
import SectionHead, { containerStyle, sectionStyle } from "./SectionHead";

export default function Projects() {
  const { t } = useApp();

  return (
    <section id="projects" style={sectionStyle}>
      <div style={containerStyle}>
        <SectionHead num="02" tag={t.projects.tag} title={t.projects.title} sub={t.projects.sub} />

        <div className="projects-grid">
          {PROJECTS.map((proj, i) => (
            <a
              key={proj.name}
              href={CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              className="proj-card"
              aria-label={`${t.projects.viewLabel}: ${proj.name}`}
              style={{
                display: "flex", flexDirection: "column", color: "inherit",
                border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, overflow: "hidden",
                background: "linear-gradient(165deg,#141a28,#10141f)", padding: 22,
                transition: "border-color .25s, transform .25s, box-shadow .25s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".82rem", color: "#5b6480", letterSpacing: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="proj-arrow" style={{ color: "var(--accent)", display: "inline-flex", transition: "transform .25s" }}>
                  <ArrowUpRight size={18} strokeWidth={2} />
                </span>
              </div>

              <div
                className="proj-thumb"
                style={{
                  position: "relative", width: "100%", aspectRatio: "16 / 10", borderRadius: 12,
                  overflow: "hidden", border: "1px solid rgba(255,255,255,.07)",
                  background: "#0e1420", marginBottom: 18,
                }}
              >
                <img src={proj.image} alt={`Preview de ${proj.name}`} loading="lazy" />
              </div>

              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "1.3rem", color: "#eef2fb", marginBottom: 10 }}>
                {proj.name}
              </h3>
              <p style={{ color: "#8a93ab", fontSize: ".97rem", marginBottom: 16, flex: 1 }}>{t.projects.descs[i]}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {proj.tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".72rem", padding: "5px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", color: "var(--accent2)", background: "var(--tint2)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
