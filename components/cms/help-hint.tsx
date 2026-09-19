"use client";

import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** The "?" beside a label. Opens on hover and on keyboard focus. */
export default function HelpHint({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label="What is this?" className="inline-flex text-muted-foreground/70 hover:text-foreground focus-visible:text-foreground">
          <CircleHelp className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty leading-5">{text}</TooltipContent>
    </Tooltip>
  );
}

/** Wraps any element (nav link, badge, tab) with an explanation. */
export function Explain({ text, side = "top", children }: { text?: string; side?: "top" | "right" | "bottom" | "left"; children: React.ReactElement }) {
  if (!text) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs text-pretty leading-5">{text}</TooltipContent>
    </Tooltip>
  );
}
