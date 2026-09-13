import { Link } from "@/i18n/navigation";

export default function JobSidebar({
  facts,
  applyLabel,
}: {
  facts: { label: string; value: string }[];
  applyLabel: string;
}) {
  return (
    <div className="rounded-[42px] bg-job-dark px-6 pt-8 pb-9 sm:px-8 sm:pt-10 sm:pb-11 lg:sticky lg:top-24 lg:px-11.25 lg:pt-12.5 lg:pb-13">
      <div className="flex flex-col gap-5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1.25">
            <p className="text-[16px] leading-6 text-accent">{fact.label}</p>
            <p className="text-[18px] leading-[24.48px] font-medium text-white">{fact.value}</p>
          </div>
        ))}
      </div>
      <Link
        href="/contact"
        className="mt-10 flex min-h-18.25 items-center justify-center rounded-full bg-accent px-4 py-3 text-center text-[18px] font-semibold tracking-wide text-[#121212] uppercase hover:opacity-90"
      >
        {applyLabel}
      </Link>
    </div>
  );
}
