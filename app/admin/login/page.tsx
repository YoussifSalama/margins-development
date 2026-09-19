import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "@/server/auth/session";
import LoginForm from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getUser()) redirect("/admin");

  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* brand side — hidden on small screens so the form stays above the fold */}
      <section className="relative isolate hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
        <Image src="/pages/projects/explore/banner.png" alt="" fill priority sizes="50vw" className="-z-20 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-primary via-primary/80 to-primary/50" />

        <Image src="/brand/logo.png" alt="Margins" width={200} height={29} className="h-7 w-auto self-start invert" />

        <div className="max-w-md">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Content Management</p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold">
            One place for every project, story and page.
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Edit once in English and Arabic — the website, the calculator and search engines all read from the same source.
          </p>
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} Margins Developments</p>
      </section>

      <section className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Image src="/brand/logo.png" alt="Margins" width={160} height={23} className="mb-10 h-6 w-auto lg:hidden" />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the website.</p>
          <LoginForm />
          <p className="mt-8 text-xs text-muted-foreground">
            Locked out or need an account? Ask an admin — accounts are created under Admin → Users.
          </p>
        </div>
      </section>
    </main>
  );
}
