import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref + boolean that flips true the first time the element enters
 * the viewport (with a margin so heavy content can warm up just before).
 * Used to defer expensive WebGL (GLSL hills, Spline robot) off the initial load.
 */
export function useInView<T extends HTMLElement>(rootMargin = "250px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
