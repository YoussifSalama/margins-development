import type { IconType } from "react-icons";
import RichText from "@/components/RichText";

export default function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <div>
      <Icon className="size-8 text-accent" />
      <h3 className="mt-6 font-heading text-[24px] text-accent">{title}</h3>
      <RichText html={description} className="mt-3 text-[16px] leading-6 text-white/70" />
    </div>
  );
}
