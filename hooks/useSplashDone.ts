"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { usePersistentState } from "@/hooks/usePersistentState";

export function useSplashDone() {
  const pathname = usePathname();
  const [seen] = usePersistentState("splash-seen", false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return false;
  return pathname === "/" ? seen : true;
}
