"use client";

import { useEffect, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";

const SCALE_START_MS = 6000;
const TOTAL_MS = 10000;
const SCALE_MS = TOTAL_MS - SCALE_START_MS;

export default function Splash() {
  const [seen, setSeen] = usePersistentState("splash-seen", false);
  const [scaling, setScaling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const active = mounted && !seen;

  useEffect(() => {
    if (!active) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // wheel/touchmove: overflow:hidden alone can still let a scroll gesture
    // through on some mobile browsers. keydown: blocks scroll-by-keyboard
    // (space/arrows/page keys) reaching any element still focusable underneath.
    const preventScroll = (e: Event) => e.preventDefault();
    const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
    const preventScrollKeys = (e: KeyboardEvent) => {
      if (scrollKeys.includes(e.key)) e.preventDefault();
    };
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", preventScrollKeys);

    const scaleTimer = setTimeout(() => setScaling(true), SCALE_START_MS);
    const doneTimer = setTimeout(() => setSeen(true), TOTAL_MS);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", preventScrollKeys);
      clearTimeout(scaleTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background:
          "radial-gradient(139% 111% at 50.8% -4950%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 99%)",
      }}
    >
      {/* scaled-in box is 953x803 centered in a 1920x1080 frame (design spec) — kept as vw/vh
         ratios so it holds that same relative size/position at other viewport sizes */}
      <video
        src="/pages/home/splash.mp4"
        autoPlay
        muted
        playsInline
        className="absolute object-cover transition-all ease-in-out"
        style={{
          transitionDuration: `${SCALE_MS}ms`,
          top: scaling ? "13.61vh" : 0,
          left: scaling ? "25.21vw" : 0,
          width: scaling ? "49.64vw" : "100vw",
          height: scaling ? "74.35vh" : "100vh",
          borderRadius: scaling ? 16 : 0,
        }}
      />
    </div>
  );
}
