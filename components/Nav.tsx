"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { spring, lightTextVariants, underlineVariants } from "@/lib/motion";

export default function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: t("home") },
    { href: "/projects", label: t("projects") },
    { href: "/news", label: t("news") },
    { href: "/careers", label: t("careers") },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-[1720px] items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          {t("brand")}
        </Link>
        <ul className="hidden gap-10 text-sm font-medium tracking-tight md:flex">
          {links.map((link) => (
            <motion.li key={link.href} initial="rest" whileHover="hover" className="relative">
              <Link href={link.href}>
                <motion.span variants={lightTextVariants} transition={{ duration: 0.2 }}>
                  {link.label}
                </motion.span>
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent"
                  variants={underlineVariants}
                  transition={spring}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <div className="hidden md:block">
            <Button href="/contact" variant="solid" className="h-11.5 px-6 text-sm">
              {t("contactCta")}
            </Button>
          </div>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-white md:hidden"
          >
            <span className="relative flex h-3.5 w-5 flex-col justify-between">
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
                className="h-px w-full bg-white"
              />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-px w-full bg-white" />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
                className="h-px w-full bg-white"
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-5 mt-2 flex flex-col gap-1 rounded-3xl bg-dark/95 p-5 backdrop-blur-md md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contact" variant="solid" className="mt-3" onClick={() => setOpen(false)}>
              {t("contactCta")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
