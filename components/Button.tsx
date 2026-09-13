"use client";

import { motion, type Transition } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ComponentProps } from "react";

const MotionLink = motion.create(Link);

type Variant = "solid" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold leading-[25.6px] tracking-[-0.16px]";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-white shadow-md shadow-accent/20 hover:shadow-xl hover:shadow-accent/50",
  ghost: "bg-white/15 text-white backdrop-blur-[16px] hover:bg-white/30 hover:shadow-xl hover:shadow-black/20",
  light: "bg-white text-[#111] shadow-md hover:bg-white hover:shadow-xl",
};

const spring: Transition = { type: "spring", stiffness: 350, damping: 12 };
const hover = { y: -4, scale: 1.03 };
const tap = { scale: 1.08, y: -4 };

// motion redefines these handlers with its own (pointer/pan) signatures,
// so the native HTML ones must be dropped before merging prop types
type ConflictingProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

type CommonProps = { variant?: Variant; className?: string };
type AsLink = CommonProps & { as?: "link" } & Omit<ComponentProps<typeof Link>, "className" | ConflictingProps>;
type AsButton = CommonProps & { as: "button" } & Omit<ComponentProps<"button">, "className" | ConflictingProps>;
// plain native <a> — for same-page hash scrolling, where the i18n Link's
// locale-prefixing logic isn't wanted (it's not a route change)
type AsAnchor = CommonProps & { as: "anchor" } & Omit<ComponentProps<"a">, "className" | ConflictingProps>;

export default function Button({
  variant = "solid",
  className = "",
  ...props
}: AsLink | AsButton | AsAnchor) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (props.as === "button") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, ...rest } = props;
    return (
      <motion.button
        {...rest}
        className={cls}
        whileHover={hover}
        whileTap={tap}
        transition={spring}
      />
    );
  }

  if (props.as === "anchor") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, ...rest } = props;
    return (
      <motion.a
        {...rest}
        className={cls}
        whileHover={hover}
        whileTap={tap}
        transition={spring}
      />
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as, ...rest } = props as AsLink;
  return (
    <MotionLink
      {...rest}
      className={cls}
      whileHover={hover}
      whileTap={tap}
      transition={spring}
    />
  );
}
