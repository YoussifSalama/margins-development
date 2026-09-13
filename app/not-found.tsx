import Image from "next/image";
import Link from "next/link";
import en from "@/messages/en.json";
import "./globals.css";

// Root-level fallback for URLs that match no route at all (no [locale]
// segment involved, so next-intl's request locale isn't available here —
// see app/[locale]/not-found.tsx for the localized version used everywhere
// inside the app, e.g. an invalid /projects/[slug]).
export default function RootNotFound() {
  const t = en.notFound;

  return (
    <html lang="en">
      <body className="bg-dark text-white antialiased">
        <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden py-24">
          <Image
            src="/pages/projects/explore/banner.png"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-40"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-dark via-dark/80 to-dark" />

          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
            <p className="text-[120px] leading-none tracking-[2px] text-accent sm:text-[160px]">
              {t.eyebrow}
            </p>
            <h1 className="max-w-2xl text-[clamp(1.75rem,4vw+1rem,3rem)] leading-[1.15] tracking-[2px]">
              This Address <span className="text-accent">Doesn&apos;t Exist</span>
            </h1>
            <p className="max-w-md text-base leading-6 text-white/70">{t.description}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white"
              >
                {t.cta}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-white/15 px-8 py-4 text-base font-semibold text-white backdrop-blur-[16px]"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
