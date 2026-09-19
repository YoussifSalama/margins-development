import { useEffect, useState, type RefObject } from "react";

// true once `amount` of the element is in view; back to false only after it has
// fully left *below* the viewport (user scrolled back above it). So entrance
// animations replay on every forward pass, never when coming back up from below.
export function useForwardInView(ref: RefObject<Element | null>, amount = 0.1, observeParent = false) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = observeParent ? ref.current!.parentElement! : ref.current!;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= amount) setShown(true);
        else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) setShown(false);
      },
      { threshold: [0, amount] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount, observeParent]);

  return shown;
}
