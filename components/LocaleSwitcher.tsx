"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      className="text-sm font-medium tracking-tight text-white/80 hover:text-white"
    >
      {next === "ar" ? "العربية" : "English"}
    </button>
  );
}
