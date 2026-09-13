import type { Transition, Variants } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 300, damping: 20 };

// mirrors --accent / --foreground in app/globals.css — Motion animates
// actual color values, it can't interpolate a css var() reference
const accentColor = "#c3a462";
const foregroundColor = "#111111";

export const zoomVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

export const accentTextVariants: Variants = {
  rest: { color: foregroundColor },
  hover: { color: accentColor },
};

// mirrors --card-ink — PostCard title on the light Blogs/News theme
const cardInkColor = "#4f4742";

export const cardTextVariants: Variants = {
  rest: { color: cardInkColor },
  hover: { color: accentColor },
};

// for light text on dark/media backgrounds (Nav, Footer)
export const lightTextVariants: Variants = {
  rest: { color: "rgba(255,255,255,0.8)" },
  hover: { color: accentColor },
};

export const underlineVariants: Variants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

export const shiftVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 4 },
};

// light text that both brightens to accent and nudges right on hover —
// footer nav columns, disclaimer link
export const footerItemVariants: Variants = {
  rest: { color: "rgba(255,255,255,0.8)", x: 0 },
  hover: { color: accentColor, x: 4 },
};
