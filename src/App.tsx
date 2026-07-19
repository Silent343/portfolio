import { useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Stack from "./components/Stack";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function RevealRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }),
      { threshold: 0.12 }
    );
    const run = () => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (reduce) el.classList.add("is-visible"); else io.observe(el);
    });
    run();
    // observe again shortly after, for late-mounted nodes
    const id = setTimeout(run, 120);
    return () => { clearTimeout(id); io.disconnect(); };
  }, []);
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <RevealRoot>
        <div style={{ position: "relative", overflowX: "hidden" }}>
          <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(1200px 800px at 82% -12%, var(--bg-glow1), transparent 60%), radial-gradient(900px 700px at -8% 28%, var(--bg-glow2), transparent 55%), #0c0f17" }} />
          <Navbar />
          <Hero />
          <About />
          <Projects />
          <Stack />
          <Services />
          <Contact />
          <Footer />
        </div>
      </RevealRoot>
    </AppProvider>
  );
}
