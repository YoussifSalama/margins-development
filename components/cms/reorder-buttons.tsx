"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { ActionResult } from "@/lib/schemas/common";
import { Button } from "@/components/ui/button";

export default function ReorderButtons({ ids, index, action }: { ids: string[]; index: number; action: (ids: string[]) => Promise<ActionResult<unknown>> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const move = (delta: -1 | 1) =>
    startTransition(async () => {
      const next = [...ids];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      const result = await action(next);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  return (
    <div className="flex">
      <Button variant="ghost" size="icon" className="size-7" disabled={pending || index === 0} onClick={() => move(-1)} aria-label="Move up" title="Move up"><ArrowUp className="size-4" /></Button>
      <Button variant="ghost" size="icon" className="size-7" disabled={pending || index === ids.length - 1} onClick={() => move(1)} aria-label="Move down" title="Move down"><ArrowDown className="size-4" /></Button>
    </div>
  );
}
