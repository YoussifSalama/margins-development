import PageShell from "@/components/cms/page-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/server/auth/session";
import { db } from "@/server/db";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Audit log" };

const labels: Record<string, string> = {
  "login.ok": "Signed in",
  "login.failed": "Failed sign-in",
  "user.created": "User created",
  "user.updated": "User updated",
  "user.deleted": "User deleted",
  "user.password-changed": "Changed own password",
  "section.saved": "Admin-only section saved",
  "calculator.destinations-changed": "Calculator destinations changed",
  "calculator.project-figures-changed": "Project calculator figures changed",
  "project.deleted": "Project deleted",
  "lead.deleted": "Lead deleted",
  "application.deleted": "Job application deleted",
  "cv.downloaded": "CV downloaded",
};

export default async function AuditPage() {
  await requireAdmin();
  const entries = await db.auditLogs.find().sort({ createdAt: -1 }).limit(300).toArray();

  return (
    <PageShell
      eyebrow="Admin"
      title="Audit log"
      description="Sign-ins, user changes, calculator figures, deletions and every CV download — newest first. Kept for 400 days."
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>When</TableHead><TableHead>Who</TableHead><TableHead>What</TableHead><TableHead>Details</TableHead><TableHead>IP</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Nothing recorded yet.</TableCell></TableRow>}
            {entries.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell className="text-sm whitespace-nowrap text-muted-foreground">{formatDateTime(entry.createdAt)}</TableCell>
                <TableCell className="text-sm">{entry.email ?? "—"}</TableCell>
                <TableCell className="text-sm font-medium">{labels[entry.action] ?? entry.action}</TableCell>
                <TableCell className="max-w-md truncate font-mono text-xs text-muted-foreground" title={JSON.stringify(entry.detail)}>
                  {Object.keys(entry.detail).length ? JSON.stringify(entry.detail) : ""}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{entry.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
