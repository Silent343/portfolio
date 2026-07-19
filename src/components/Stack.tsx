import { useApp } from "../context/AppContext";
import { TOOLGROUPS, DEVICON } from "../data/content";
import SectionHead, { sectionStyle, containerStyle } from "./SectionHead";

export default function Stack() {
  const { t } = useApp();
  return (
    <section id="langs" style={sectionStyle}>
      <div style={containerStyle}>
        <SectionHead num="03" tag={t.langs.tag} title={t.langs.title} sub={t.langs.sub} />
        {TOOLGROUPS.map((gr) => (
          <div key={gr.cat} style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, fontSize: ".78rem", letterSpacing: 2, textTransform: "uppercase", color: "#5b6480", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
              {t.langs.cats[gr.cat]}<span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 12 }}>
              {gr.items.map(([name, path, inv]) => (
                <div key={name} data-reveal className="tool-card" style={{ background: "#121826", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "18px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "transform .22s, border-color .22s, background .22s" }}>
                  <img src={DEVICON + path} alt={name} loading="lazy" style={{ width: 36, height: 36, objectFit: "contain", filter: inv ? "invert(.92)" : "none" }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".72rem", color: "#9aa3ba", textAlign: "center" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
