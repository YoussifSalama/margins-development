import Link from "next/link";
import { cn } from "@/lib/utils";

/** URL-driven filters (?type=news) so lists stay server-rendered and shareable. */
export default function FilterTabs({
  basePath,
  param,
  active,
  options,
  keep,
}: {
  basePath: string;
  param: string;
  active?: string;
  options: { value?: string; label: string }[];
  keep?: Record<string, string | undefined>;
}) {
  return (
    <div data-tour="filters" className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
      {options.map((option) => {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(keep ?? {})) if (value) query.set(key, value);
        if (option.value) query.set(param, option.value);
        const href = query.size ? `${basePath}?${query}` : basePath;
        return (
          <Link
            key={option.label}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              active === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
