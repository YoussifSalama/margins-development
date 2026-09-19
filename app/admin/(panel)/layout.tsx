import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireUser } from "@/server/auth/session";
import { logout } from "@/server/auth/actions";
import { Button } from "@/components/ui/button";
import SidebarNav from "@/components/cms/sidebar-nav";
import { FirstVisitTour } from "@/components/cms/tour";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  // UX gate only — layouts don't re-run on every navigation. Every query and
  // server function re-checks the session itself (server/auth/session.ts).
  const user = await requireUser();

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside data-tour="sidebar" className="cms-sidebar flex flex-col gap-8 bg-primary p-5 text-white lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto">
        <Link href="/admin" className="px-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Margins</p>
          <p className="text-lg font-bold">CMS</p>
        </Link>
        <SidebarNav isAdmin={user.role === "admin"} />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 px-3 pt-4">
          <Link href="/admin/account" data-tour="account" title="Your account — change your password" className="min-w-0 hover:opacity-80">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs text-white/50 capitalize">{user.role}</p>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out" title="Sign out" className="text-white/70 hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-6 lg:p-10">{children}</main>
      <FirstVisitTour />
    </div>
  );
}
