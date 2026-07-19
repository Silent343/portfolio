"use client";
import { Suspense, lazy, useState } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="loader"></span>
          </div>
        )}
        {/* Keep the scene hidden until it fully loads, then fade it in — this
            avoids the visible "grow from nothing" pop during initialization. */}
        <div style={{ width: "100%", height: "100%", opacity: loaded ? 1 : 0, transition: "opacity .8s ease" }}>
          <Spline scene={scene} onLoad={() => setLoaded(true)} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </Suspense>
  );
}
