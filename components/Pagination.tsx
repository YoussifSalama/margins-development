import { Link } from "@/i18n/navigation";

// SSR-only — page links are real URLs, no client-side page state. The category lives
// in basePath (/media/news). With `defaultLimit`, page 1 and the default page size produce
// a clean URL, so /media/news and /media/news?page=1&limit=5 aren't two addresses for one page.
export default function Pagination({
  basePath,
  page,
  totalPages,
  limit,
  defaultLimit,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  limit: number;
  defaultLimit?: number;
}) {
  if (totalPages <= 1) return null;

  function queryFor(p: number) {
    if (defaultLimit === undefined) return { page: String(p), limit: String(limit) };
    const query: Record<string, string> = {};
    if (p > 1) query.page = String(p);
    if (limit !== defaultLimit) query.limit = String(limit);
    return query;
  }

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={{ pathname: basePath, query: queryFor(p) }}
          aria-current={p === page ? "page" : undefined}
          className={`flex size-10 items-center justify-center rounded-full text-sm ${
            p === page ? "bg-accent text-white" : "text-tab-muted hover:text-foreground"
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
