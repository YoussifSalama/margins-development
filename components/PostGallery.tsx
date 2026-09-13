import Image from "next/image";

export default function PostGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {images.map((src, i) => (
        <div key={src} className="relative aspect-468.6/310 overflow-hidden rounded-xl">
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
