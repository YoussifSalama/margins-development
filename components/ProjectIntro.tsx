import Image from "next/image";

export default function ProjectIntro({ name, description }: { name: string; description: string }) {
  return (
    <section className="container flex flex-col items-center gap-10 py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="relative aspect-112.25/121 w-56 shrink-0 overflow-hidden rounded-lg max-lg:hidden xl:w-112.25">
        <Image src="/pages/projects/detail/intro-left.png" alt="" fill sizes="(min-width: 1280px) 450px, 224px" className="object-cover" />
      </div>

      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] text-foreground">{name}</h2>
        <p className="text-lg leading-[1.4] text-body">{description}</p>
      </div>

      <div className="relative aspect-102.5/131 w-48 shrink-0 overflow-hidden rounded-lg max-lg:hidden xl:w-102.5">
        <Image src="/pages/projects/detail/intro-right.png" alt="" fill sizes="(min-width: 1280px) 410px, 192px" className="object-cover" />
      </div>
    </section>
  );
}
