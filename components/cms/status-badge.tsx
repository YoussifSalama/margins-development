import { Badge } from "@/components/ui/badge";
import { statusHelp } from "@/lib/cms/help";
import { Explain } from "./help-hint";

const styles: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-800",
  Open: "bg-emerald-100 text-emerald-800",
  Scheduled: "bg-sky-100 text-sky-800",
  Draft: "bg-amber-100 text-amber-800",
  Archived: "bg-neutral-200 text-neutral-700",
  Closed: "bg-neutral-200 text-neutral-700",
};

/** "Scheduled" isn't stored — it's published with a future date. */
export function publishLabel(status: string, publishedAt?: Date | string | null) {
  if (status === "published" && publishedAt && new Date(publishedAt) > new Date()) return "Scheduled";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function StatusBadge({ status, publishedAt }: { status: string; publishedAt?: Date | string | null }) {
  const label = publishLabel(status, publishedAt);
  return (
    <Explain text={statusHelp[label]}>
      <Badge tabIndex={0} className={styles[label] ?? ""}>{label}</Badge>
    </Explain>
  );
}
