interface Props { num: string; tag: string; title: string; sub?: string; }

export default function SectionHead({ num, tag, title, sub }: Props) {
  return (
    <div data-reveal style={{ maxWidth: 640, marginBottom: 44 }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ color: "#5b6480" }}>{num}</span>{tag}
      </div>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem,4.5vw,2.85rem)", letterSpacing: "-1px", lineHeight: 1.06, color: "#eef2fb" }}>{title}</h2>
      {sub && <p style={{ color: "#8a93ab", marginTop: 14, fontSize: "1.05rem", maxWidth: 560 }}>{sub}</p>}
    </div>
  );
}

export const sectionStyle: React.CSSProperties = { position: "relative", zIndex: 1, padding: "clamp(72px,10vw,120px) 0" };
export const containerStyle: React.CSSProperties = { maxWidth: 1140, margin: "0 auto", padding: "0 24px" };
