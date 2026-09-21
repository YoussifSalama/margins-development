import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function ProjectGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {images.map((src, i) => (
          <Reveal key={src} className="relative aspect-[3/2] overflow-hidden rounded-xl">
            {/\.(mp4|webm)(\?|$)/i.test(src) ? (
              <video src={src} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
            ) : (
              <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" priority={i === 0} />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
