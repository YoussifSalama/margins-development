import PageShell from "@/components/cms/page-shell";
import { ActionButton } from "@/components/cms/row-actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listSubscribers } from "@/server/inbox/queries";
import { deleteSubscriber } from "@/server/inbox/actions";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  const subscribers = await listSubscribers();
  const csv = ["email,locale,subscribed_at", ...subscribers.map((s) => `${s.email},${s.locale},${s.createdAt.toISOString()}`)].join("\n");

  return (
    <PageShell
      tour="inbox"
      eyebrow="Inbox"
      title="Subscribers"
      description="Newsletter sign-ups from the footer form."
      actions={
        subscribers.length > 0 && (
          <Button asChild variant="outline">
            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="margins-subscribers.csv">Export CSV</a>
          </Button>
        )
      }
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Language</TableHead><TableHead>Subscribed</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {subscribers.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No subscribers yet.</TableCell></TableRow>}
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell className="uppercase">{subscriber.locale}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(subscriber.createdAt)}</TableCell>
                <TableCell className="text-end">
                  <ActionButton action={deleteSubscriber.bind(null, subscriber.id)} confirm={`Remove ${subscriber.email}?`} variant="ghost" className="text-destructive">Remove</ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
