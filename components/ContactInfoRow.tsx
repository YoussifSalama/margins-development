import type { IconType } from "react-icons";

export default function ContactInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent p-4.5">
        <Icon className="size-7 text-white" />
      </div>
      <div>
        <p className="font-heading text-[16px] leading-6 text-white">{label}</p>
        <p className="mt-[1.5px] text-[16px] leading-6 text-white">{value}</p>
      </div>
    </div>
  );
}
