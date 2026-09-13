import Image from "next/image";

export default function ChairmanCard({
  image,
  name,
  credential,
  description,
}: {
  image: string;
  name: string;
  credential: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-14.25 lg:flex-row">
      <div className="w-full max-w-[433.36px]">
        <div className="relative aspect-433.36/545 w-full overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 433px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-6.5 text-center text-[24px] leading-7 font-semibold tracking-[-0.32px] text-black">
          {name}
        </p>
        <p className="mt-3.25 text-center text-[20px] leading-7 tracking-[-0.32px] text-dark">
          {credential}
        </p>
      </div>
      <p className="max-w-md text-[20px] leading-7 tracking-[-0.32px] text-black">
        {description}
      </p>
    </div>
  );
}
