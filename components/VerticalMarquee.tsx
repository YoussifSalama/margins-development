import Image from "next/image";

export default function VerticalMarquee({
  images,
  direction = "up",
  duration = 35,
}: {
  images: string[];
  direction?: "up" | "down";
  duration?: number;
}) {
  const track = [...images, ...images];

  return (
    <div className="h-full w-68.5 shrink-0 overflow-hidden">
      <div
        className="flex flex-col gap-2"
        style={{
          animationName: direction === "up" ? "marquee-up" : "marquee-down",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {track.map((src, i) => (
          <div key={i} className="relative h-45 w-68.5 shrink-0 overflow-hidden">
            <Image src={src} alt="" fill sizes="274px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
