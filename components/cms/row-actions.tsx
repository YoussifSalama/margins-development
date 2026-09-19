"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/schemas/common";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Variant = React.ComponentProps<typeof Button>["variant"];

/** A button bound to one server function; confirms first when `confirm` is set. */
export function ActionButton({
  action,
  children,
  success,
  confirm,
  redirectTo,
  variant = "outline",
  className,
}: {
  action: () => Promise<ActionResult<unknown>>;
  children: React.ReactNode;
  success?: string;
  confirm?: string;
  redirectTo?: string;
  variant?: Variant;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = () => {
    if (confirm && !window.confirm(confirm)) return;
    startTransition(async () => {
      const result = await action();
      if (!result.ok) return void toast.error(result.error);
      if (success) toast.success(success);
      if (redirectTo) router.replace(redirectTo);
      else router.refresh();
    });
  };

  return <Button type="button" size="sm" variant={variant} className={className} disabled={pending} onClick={run}>{children}</Button>;
}

export function StatusSelect({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (value: string) => Promise<ActionResult<unknown>> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(next) =>
        startTransition(async () => {
          const result = await onChange(next);
          if (!result.ok) toast.error(result.error);
          router.refresh();
        })
      }
    >
      <SelectTrigger size="sm" className="w-36 capitalize"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="capitalize">{option}</SelectItem>)}</SelectContent>
    </Select>
  );
}

/** Opens a short-lived signed link in a new tab. */
export function OpenLinkButton({ getUrl, children }: { getUrl: () => Promise<ActionResult<string>>; children: React.ReactNode }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await getUrl();
          if (result.ok) window.open(result.data, "_blank", "noopener");
          else toast.error(result.error);
        })
      }
    >
      {children}
    </Button>
  );
}
