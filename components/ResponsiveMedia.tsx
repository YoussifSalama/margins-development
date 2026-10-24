import Image from "next/image";

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src);

type One = { src: string; alt: string; sizes: string; priority?: boolean; className: string };

function Media({ src, alt, sizes, priority, className }: One) {
  return isVideo(src) ? (
    <video src={src} autoPlay muted loop playsInline className={`absolute inset-0 size-full object-cover ${className}`} />
  ) : (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  );
}

/**
 * Image or video filling its (relative) parent. With `mobileSrc`, that file replaces `src`
 * below the md breakpoint (phones and tablets). `sizes` must be a single length (e.g. "100vw").
 */
export default function ResponsiveMedia({
  src,
  mobileSrc,
  alt = "",
  sizes = "100vw",
  priority,
  className = "",
}: {
  src: string;
  mobileSrc?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!mobileSrc) return <Media src={src} alt={alt} sizes={sizes} priority={priority} className={className} />;
  // ponytail: both files sit in the DOM and CSS shows one. The hidden image's `sizes` collapses it to the
  // smallest srcset candidate, so it costs ~nothing; two videos still both load — move to <source media> if that bites.
  return (
    <>
      <Media src={src} alt={alt} sizes={`(min-width: 768px) ${sizes}, 1px`} priority={priority} className={`hidden md:block ${className}`} />
      <Media src={mobileSrc} alt={alt} sizes={`(min-width: 768px) 1px, ${sizes}`} priority={priority} className={`md:hidden ${className}`} />
    </>
  );
}
