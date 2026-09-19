import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { TourKey } from "@/lib/cms/tours";
import { TourButton } from "./tour";

export default function PageShell({
  eyebrow,
  title,
  description,
  back,
  actions,
  tour,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  /** adds a "Tour this page" button that spotlights the parts of this kind of screen */
  tour?: TourKey;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      {back && (
        <Link href={back.href} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div data-tour="page-header">
          {eyebrow && <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>}
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {tour && <TourButton tour={tour} />}
          {actions && <div data-tour="page-actions" className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function SectionCard({ title, hint, children }: { title?: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-card p-6">
      {title && (
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
