import { useApp } from "../context/AppContext";
import { CONFIG } from "../data/content";

export default function Footer() {
  const { t } = useApp();
  const year = new Date().getFullYear();
  return (
    <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,.08)", padding: "40px 0 44px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".82rem", color: "#5b6480" }}>
          © {year} Gabriel · {t.footer.made} <span style={{ color: "var(--accent)" }}>☕</span> {t.footer.and} Three.js<br />
          <span style={{ opacity: .75 }}>
            {t.footer.catcredit} <a href="https://sketchfab.com/omabuarts" target="_blank" rel="noopener" style={{ textDecoration: "underline", color: "#5b6480" }}>Omabuarts Studio</a> · <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener" style={{ textDecoration: "underline", color: "#5b6480" }}>CC BY 4.0</a>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href={CONFIG.github} target="_blank" rel="noopener" aria-label="GitHub" className="foot-ico" style={footIco}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" /></svg>
          </a>
          <a href={CONFIG.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="foot-ico" style={footIco}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

const footIco: React.CSSProperties = {
  width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "1px solid rgba(255,255,255,.14)", color: "#8a93ab",
  transition: "color .2s, border-color .2s, transform .2s",
};
