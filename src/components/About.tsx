import { useApp } from "../context/AppContext";
import SectionHead, { sectionStyle, containerStyle } from "./SectionHead";

export default function About() {
  const { t } = useApp();
  return (
    <section id="about" style={sectionStyle}>
      <div style={containerStyle}>
        <SectionHead num="01" tag={t.about.tag} title={t.about.title} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 44 }}>
          <div data-reveal style={{ flex: "1 1 380px", minWidth: 0 }}>
            <p style={{ color: "#9aa3ba", fontSize: "1.08rem", marginBottom: 18 }}>{t.about.p1}</p>
            <p style={{ color: "#9aa3ba", fontSize: "1.08rem" }}>{t.about.p2}</p>
          </div>
          <div data-reveal style={{ flex: "1 1 260px", minWidth: 0 }}>
            {t.about.facts.map((f) => (
              <div key={f.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.08)", fontSize: ".95rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#5b6480", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: 1 }}>{f.k}</span>
                <span style={{ color: "#eef2fb", textAlign: "right", fontWeight: 500 }}>{f.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
