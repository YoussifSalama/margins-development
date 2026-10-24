import { ReactNode } from "react";
import ResponsiveMedia from "@/components/ResponsiveMedia";

type Props = {
  src: string;
  /** shown instead of `src` below 1024px (phones and tablets) */
  mobileSrc?: string;
  overlay?: boolean;
  /** flat tint class (e.g. "bg-dark/20") straight over the media — hero sections only, not the footer CTA */
  tint?: string;
  className?: string;
  children: ReactNode;
};

export default function MediaBackground({
  src,
  mobileSrc,
  overlay = true,
  tint,
  className = "",
  children,
}: Props) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <ResponsiveMedia src={src} mobileSrc={mobileSrc} className="-z-10" />
      {tint && <div aria-hidden className={`absolute inset-0 -z-10 ${tint}`} />}
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(39,27,21,0) 0%, var(--dark) 94.31%)",
          }}
        />
      )}
      {children}
    </div>
  );
}
