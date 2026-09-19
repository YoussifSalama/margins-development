import PageShell from "@/components/cms/page-shell";
import { requireUser } from "@/server/auth/session";
import PasswordForm from "./password-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <PageShell eyebrow="Account" title={user.name} description={`${user.email} · ${user.role}`}>
      <PasswordForm />
    </PageShell>
  );
}
