import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  src: string;
  type?: "image" | "video";
  overlay?: boolean;
  className?: string;
  children: ReactNode;
};

export default function MediaBackground({
  src,
  type,
  overlay = true,
  className = "",
  children,
}: Props) {
  const isVideo = type === "video" || /\.(mp4|webm|mov)$/i.test(src);

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {isVideo ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <Image src={src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      )}
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
