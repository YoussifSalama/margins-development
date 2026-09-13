import { Link } from "@/i18n/navigation";

// SSR-only — page links carry category/limit forward via query params,
// no client-side page state
export default function Pagination({
  basePath,
  page,
  totalPages,
  category,
  limit,
}: {
  basePath: "/news" | "/blogs" | "/projects";
  page: number;
  totalPages: number;
  category?: string;
  limit: number;
}) {
  if (totalPages <= 1) return null;

  function queryFor(p: number) {
    const query: Record<string, string> = { page: String(p), limit: String(limit) };
    if (category) query.category = category;
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
