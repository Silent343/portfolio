import { useApp } from "../context/AppContext";
import SectionHead, { sectionStyle, containerStyle } from "./SectionHead";

export default function Services() {
  const { t } = useApp();
  return (
    <section id="services" style={sectionStyle}>
      <div style={containerStyle}>
        <SectionHead num="04" tag={t.services.tag} title={t.services.title} sub={t.services.sub} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(238px,1fr))", gap: 18 }}>
          {t.services.items.map((s, i) => (
            <div key={s.title} data-reveal className="svc-card" style={{ position: "relative", background: "linear-gradient(165deg,#161d2e,#121826)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 16, padding: "26px 24px 28px", overflow: "hidden", transition: "transform .25s, border-color .25s" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--accent),var(--accent2))", opacity: .6 }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".8rem", color: "var(--accent2)", letterSpacing: 1 }}>{"S" + String(i + 1).padStart(2, "0")}</span>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "1.18rem", color: "#eef2fb", margin: "12px 0 10px" }}>{s.title}</h3>
              <p style={{ color: "#8a93ab", fontSize: ".95rem" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
