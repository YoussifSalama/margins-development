import PageShell from "@/components/cms/page-shell";
import { requireAdmin } from "@/server/auth/session";
import { listUsers } from "@/server/users/actions";
import UsersManager from "./users-manager";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireAdmin();
  return (
    <PageShell tour="simpleList" eyebrow="Admin" title="Users" description="Admins manage users, site settings and calculator figures. Editors manage content, pages and the inbox.">
      <UsersManager items={await listUsers()} meId={me.id} />
    </PageShell>
  );
}
