import Image from "next/image";

export default function StatCard({
  value,
  label,
  caption,
  image,
}: {
  value: string;
  label: string;
  caption: string;
  image: string;
}) {
  return (
    <div className="relative flex aspect-518/292 flex-col justify-between overflow-hidden rounded-[19px] bg-dark p-5 text-white sm:p-6 lg:p-8.75">
      {/* ponytail: placeholder bg (bg-dark) shows through — swap in real photo + per-card tint once provided */}
      <Image src={image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="-z-10 object-cover opacity-60" />
      <div>
        <p className="text-[clamp(1.75rem,6vw,4.1875rem)] leading-[1.05] font-bold tracking-[-1px]">{value}</p>
        <p className="mt-1 text-[15px] sm:text-[18px] leading-5 font-medium tracking-[-0.36px]">{label}</p>
      </div>
      <p className="text-[14px] sm:text-[16px] leading-6 font-semibold tracking-[-0.96px]">{caption}</p>
    </div>
  );
}
