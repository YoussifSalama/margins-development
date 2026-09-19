"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { cmsNav } from "./nav";
import { Explain } from "./help-hint";

export default function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {cmsNav.map((group) => {
        const items = group.items.filter((item) => isAdmin || !item.adminOnly);
        if (items.length === 0) return null;
        return (
          <div key={group.label} data-tour={`nav-${group.label.toLowerCase()}`} className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase">{group.label}</p>
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Explain key={item.href} text={item.description} side="right">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-gold text-primary" : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
                </Explain>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
