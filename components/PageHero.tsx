import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";

export default function PageHero({
  title,
  description,
  current,
  image,
  overlayClassName = "bg-black/40",
}: {
  title: string;
  description: string;
  current: string;
  image: string;
  overlayClassName?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[380px] items-end justify-center overflow-hidden bg-dark px-6 pb-10 text-center text-white sm:min-h-[420px] sm:pb-[60px] lg:min-h-[498px]">
      <Image src={image} alt="" fill sizes="100vw" priority className="-z-10 object-cover" />
      <div aria-hidden className={`absolute inset-0 -z-10 ${overlayClassName}`} />
      <div className="flex flex-col items-center">
        <h1 className="max-w-2xl text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] font-light tracking-[2px] font-heading">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-[24px] tracking-[-0.16px]">
          {description}
        </p>
        <div className="mt-10 sm:mt-20">
          <Breadcrumb items={[{ label: current }]} />
        </div>
      </div>
    </section>
  );
}
