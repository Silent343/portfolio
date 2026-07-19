import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { PALETTE_NAMES } from "../data/content";

export default function Navbar() {
  const { t, isEs, setLang, palette, setPalette } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 780 : false);
  const [showPalettes, setShowPalettes] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onResize = () => setMobile(window.innerWidth < 780);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const close = () => setMenuOpen(false);
  const links: [string, string][] = [
    ["#about", t.nav.about], ["#projects", t.nav.projects], ["#langs", t.nav.langs],
    ["#services", t.nav.services], ["#contact", t.nav.contact],
  ];

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "15px 24px", backdropFilter: "blur(12px)",
    transition: "background .3s, border-color .3s",
    borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,.08)" : "transparent"}`,
    background: scrolled ? "rgba(12,15,23,.92)" : "linear-gradient(180deg, rgba(12,15,23,.85), rgba(12,15,23,.2))",
  };

  let navLinks: React.CSSProperties;
  if (!mobile) navLinks = { display: "flex", alignItems: "center", gap: 26 };
  else if (menuOpen) navLinks = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18, position: "absolute", top: 60, left: 0, right: 0, padding: "22px 24px", background: "rgba(12,15,23,.98)", borderBottom: "1px solid rgba(255,255,255,.08)" };
  else navLinks = { display: "none" };

  const activeBtn: React.CSSProperties = { background: "var(--accent)", color: "var(--on-accent)", border: "none", cursor: "pointer", padding: "6px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600 };
  const idleBtn: React.CSSProperties = { background: "transparent", color: "#8a93ab", border: "none", cursor: "pointer", padding: "6px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600 };

  return (
    <nav style={navStyle}>
      <a href="#top" onClick={close} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: 15, letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 9, color: "#eef2fb" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 14px var(--accent)", animation: "gpulse 2.4s ease-in-out infinite" }} />
        gabriel<span style={{ color: "#5b6480" }}>.dev</span>
      </a>

      <div style={navLinks}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={close} className="nav-link" style={{ fontSize: 14, color: "#8a93ab", fontWeight: 500, transition: "color .2s" }}>
            {label}
          </a>
        ))}

        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, overflow: "hidden", alignSelf: "flex-start" }}>
          <button onClick={() => setLang("es")} style={isEs ? activeBtn : idleBtn}>ES</button>
          <button onClick={() => setLang("en")} style={isEs ? idleBtn : activeBtn}>EN</button>
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowPalettes((v) => !v)}
            aria-label="Tema"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, padding: "6px 12px", cursor: "pointer", color: "#8a93ab", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", border: "1px solid rgba(255,255,255,.25)" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent2)", border: "1px solid rgba(255,255,255,.25)" }} />
          </button>
          {showPalettes && (
            <div style={{ position: "absolute", top: 40, right: 0, background: "rgba(12,15,23,.98)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 6, minWidth: 190, zIndex: 60 }}>
              {PALETTE_NAMES.map((name) => (
                <button
                  key={name}
                  onClick={() => { setPalette(name); setShowPalettes(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: name === palette ? "rgba(255,255,255,.06)" : "transparent", border: "none", cursor: "pointer", padding: "8px 10px", borderRadius: 8, color: "#cdd4e4", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "left" }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: paletteDot(name) }} />
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: mobile ? "block" : "none" }}>
        <span style={{ display: "block", width: 22, height: 2, background: "#eef2fb", margin: "4px 0" }} />
        <span style={{ display: "block", width: 22, height: 2, background: "#eef2fb", margin: "4px 0" }} />
        <span style={{ display: "block", width: 22, height: 2, background: "#eef2fb", margin: "4px 0" }} />
      </button>
    </nav>
  );
}

function paletteDot(name: string) {
  const map: Record<string, string> = {
    "Charcoal + Emerald": "#10b981",
    "Slate + Azure": "#3b82f6",
    "Ink + Violet": "#8b7cf6",
    "Graphite + Copper": "#c8794b",
    "Ámbar (original)": "#f4934e",
  };
  return map[name] || "#c8794b";
}
