import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

declare global {
  interface Window {
    THREE?: any;
    initCatScene?: () => boolean;
    __catStarted?: boolean;
  }
}

function loadScript(src: string) {
  return new Promise<void>((res, rej) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.onload = () => res();
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

export default function Hero() {
  const { t } = useApp();
  const started = useRef(false);

  useEffect(() => {
    // Guard against double-run (React StrictMode). Do NOT cancel the init
    // polling on cleanup — the cat scene has its own __catStarted guard, and
    // aborting here previously stopped the scene from ever starting.
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        if (!window.THREE) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
        if (!(window.THREE && window.THREE.GLTFLoader)) await loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js");
        if (!window.initCatScene) await loadScript("/cat-scene.js");
        let tries = 0;
        const tick = () => {
          if (window.initCatScene && window.initCatScene()) return;
          if (tries++ < 200) setTimeout(tick, 60);
        };
        tick();
      } catch (e) {
        console.warn("[cat] load failed", e);
      }
    })();
  }, []);

  const ctaPrimary: React.CSSProperties = {
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 15,
    padding: "14px 26px", borderRadius: 999, background: "var(--accent)",
    color: "var(--on-accent)", display: "inline-flex", alignItems: "center", gap: 8,
    boxShadow: "0 8px 30px var(--glow-a)", transition: "transform .18s, box-shadow .25s",
  };
  const ctaSecondary: React.CSSProperties = {
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 15,
    padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)",
    color: "#eef2fb", background: "rgba(255,255,255,.02)", display: "inline-flex",
    alignItems: "center", gap: 8, transition: "transform .18s, border-color .2s, color .2s",
  };

  return (
    <header id="top" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", zIndex: 1 }}>
      <canvas id="cat-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(90deg, rgba(12,15,23,.95) 0%, rgba(12,15,23,.58) 42%, transparent 74%), linear-gradient(0deg, #0c0f17 2%, transparent 34%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1140, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        <div style={{ maxWidth: 660 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, letterSpacing: "1px", color: "var(--accent2)", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 26, height: 1, background: "var(--accent2)" }} />{t.hero.eyebrow}
          </span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(2.6rem,7vw,4.7rem)", lineHeight: 1.02, letterSpacing: "-1.5px", marginBottom: 10 }}>
            {t.hero.hiPre}<span style={{ color: "var(--accent)" }}>Gabriel</span>
          </h1>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: "clamp(1.05rem,2.4vw,1.45rem)", color: "#c3cbe0", marginBottom: 18 }}>{t.hero.role}</div>
          <p style={{ color: "#9aa3ba", fontSize: "1.08rem", maxWidth: 560, marginBottom: 30 }}>{t.hero.tagline}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#projects" style={ctaPrimary}>{t.hero.cta1} →</a>
            <a href="#contact" style={ctaSecondary}>{t.hero.cta2}</a>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 26, bottom: 26, zIndex: 2, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#5b6480", textAlign: "right", maxWidth: 210, lineHeight: 1.4 }} className="cat-cap">{t.hero.catcap}</div>
      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 2, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#5b6480", letterSpacing: 2, textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span>{t.hero.scroll}</span>
        <span style={{ width: 1, height: 34, background: "linear-gradient(#5b6480,transparent)", animation: "gdrop 1.8s ease-in-out infinite" }} />
      </div>
    </header>
  );
}
