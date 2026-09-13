import Image from "next/image";

export default function ApproachCard({
  number,
  title,
  description,
  image,
}: {
  number: number;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[24px] bg-background p-6 shadow-xl shadow-black/20 sm:p-8 lg:flex-row lg:gap-10 lg:p-10">
      <div className="flex w-full flex-col gap-4 lg:w-115 lg:shrink-0">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-dark text-sm text-white">
          {String(number).padStart(2, "0")}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[28px] leading-[1.2] text-foreground">{title}</h3>
          <p className="text-[16px] leading-6 text-muted">{description}</p>
        </div>
      </div>

      <div className="relative aspect-[1015/472] w-full overflow-hidden rounded-2xl">
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}
