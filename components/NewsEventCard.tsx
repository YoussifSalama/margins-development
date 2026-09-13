import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Variant = "featured" | "horizontal-lg" | "horizontal-sm";

export default function NewsEventCard({
  href,
  eyebrow,
  title,
  description,
  image,
  variant,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  variant: Variant;
}) {
  if (variant === "featured") {
    return (
      <Link href={href} className="group flex flex-col gap-6">
        <div className="relative aspect-[987/456] w-full overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-muted">{eyebrow}</p>
          <h3 className="font-heading text-[28px] leading-[1.2] text-foreground">{title}</h3>
          <p className="text-[15px] leading-6 text-muted">{description}</p>
        </div>
      </Link>
    );
  }

  const compact = variant === "horizontal-sm";

  return (
    <Link href={href} className="group flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-2xl ${
          compact ? "aspect-[327/206] sm:w-1/3" : "aspect-[511/414] sm:w-[47%]"
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-[13px] text-muted">{eyebrow}</p>
        <h3 className={`font-heading leading-[1.2] text-foreground ${compact ? "text-[18px]" : "text-[28px]"}`}>
          {title}
        </h3>
        {!compact && <p className="text-[15px] leading-6 text-muted">{description}</p>}
      </div>
    </Link>
  );
}
