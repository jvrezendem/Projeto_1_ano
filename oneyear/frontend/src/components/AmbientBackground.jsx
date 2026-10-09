import { useEffect, useRef } from "react";

export default function AmbientBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const element = backgroundRef.current;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointerX = window.innerWidth * 0.76;
    let pointerY = window.innerHeight * 0.18;

    const render = () => {
      frame = 0;
      const progress = document.documentElement.scrollHeight > window.innerHeight
        ? window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
        : 0;
      root.style.setProperty("--page-progress", String(Math.min(1, Math.max(0, progress))));
      if (!element || reduceMotion.matches || root.dataset.motion === "paused") return;
      const normalizedX = pointerX / window.innerWidth - 0.5;
      const normalizedY = pointerY / window.innerHeight - 0.5;
      element.style.setProperty("--mouse-x", `${pointerX}px`);
      element.style.setProperty("--mouse-y", `${pointerY}px`);
      element.style.setProperty("--pointer-x", `${normalizedX * 14}px`);
      element.style.setProperty("--pointer-y", `${normalizedY * 10}px`);
      element.style.setProperty("--pointer-red-x", `${normalizedX * -7.7}px`);
      element.style.setProperty("--pointer-red-y", `${normalizedY * -4}px`);
      element.style.setProperty("--pointer-slate-x", `${normalizedX * 4.2}px`);
      element.style.setProperty("--pointer-slate-y", `${normalizedY * -6}px`);
      element.style.setProperty("--pointer-rotate", `${normalizedX * 0.8}deg`);
      element.style.setProperty("--scroll-shift", `${window.scrollY * -0.035}px`);
      root.style.setProperty("--pointer-x", `${normalizedX * 14}px`);
      root.style.setProperty("--pointer-y", `${normalizedY * 10}px`);
      root.style.setProperty("--pointer-rotate", `${normalizedX * 0.8}deg`);
      root.style.setProperty("--scroll-shift", `${window.scrollY * -0.035}px`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={backgroundRef} className="ambient-background" aria-hidden="true">
      <i className="ambient-orb ambient-orb--blue" />
      <i className="ambient-orb ambient-orb--red" />
      <i className="ambient-orb ambient-orb--slate" />
      <span className="ambient-grid" />
    </div>
  );
}
