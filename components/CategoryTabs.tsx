import { Link } from "@/i18n/navigation";

type Tab = { label: string; category?: string };

// SSR-only — every tab is a real link carrying category/page/limit query
// params, no client-side filter state
export default function CategoryTabs({
  basePath,
  active,
  limit,
  tabs,
}: {
  basePath: "/news" | "/blogs";
  active?: string;
  limit: number;
  tabs: Tab[];
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => {
        const isActive = tab.category === active || (!tab.category && !active);
        const query: Record<string, string> = { page: "1", limit: String(limit) };
        if (tab.category) query.category = tab.category;

        return (
          <Link
            key={tab.label}
            href={{ pathname: basePath, query }}
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
