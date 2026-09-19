import { Link } from "@/i18n/navigation";

export const DEFAULT_LIMIT = 5;

type Tab = { label: string; category?: string; href: string };

// SSR-only — every tab is a real link to its own path (/media, /media/news…),
// no client-side filter state and no ?category= query for crawlers to dedupe
export default function CategoryTabs({
  active,
  limit,
  tabs,
}: {
  active?: string;
  limit: number;
  tabs: Tab[];
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => {
        const isActive = tab.category === active || (!tab.category && !active);
        // only a non-default page size is worth a query string
        const query = limit === DEFAULT_LIMIT ? undefined : { limit: String(limit) };

        return (
          <Link
            key={tab.label}
            href={{ pathname: tab.href, query }}
            className={`flex h-13.75 items-center justify-center rounded-full px-6 text-sm ${
              isActive
                ? "bg-accent font-semibold text-white"
                : "border border-black/10 bg-white/5 font-medium text-tab-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
