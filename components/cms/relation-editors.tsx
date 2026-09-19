"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { Localized } from "@/lib/schemas/common";
import { saveCalculatorDestinations, saveHomeShowcase, saveMainPost } from "@/server/pages/actions";
import type { ActionResult } from "@/lib/schemas/common";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "./page-shell";
import { MediaPreview } from "./media-field";
import StatusBadge from "./status-badge";

type ProjectOption = { id: string; name: Localized; status: string; coverImage: string | null };

/** Home showcase: which projects, in what order. */
export function ShowcasePicker(props: { selected: ProjectOption[]; options: ProjectOption[] }) {
  return (
    <ProjectPicker
      {...props}
      title="Showcased projects"
      hint="Pick from existing projects and order them. Unpublished projects are skipped on the website until they go live."
      emptyText="Nothing picked — the showcase is hidden."
      saveLabel="Save showcase"
      action={saveHomeShowcase}
    />
  );
}

/** Calculator: which projects appear on the Destination step, in what order. */
export function CalculatorDestinationsPicker(props: { selected: ProjectOption[]; options: ProjectOption[] }) {
  return (
    <ProjectPicker
      {...props}
      title="Destinations"
      hint="The projects a visitor can choose on the calculator's first step, in this order. A project only shows up once it is published and has at least one unit with a price and a rent — the preview below tells you which ones are ready."
      emptyText="Nothing picked — the calculator has no destinations."
      saveLabel="Save destinations"
      action={saveCalculatorDestinations}
    />
  );
}

/** Ordered pick of existing projects. Stores ids only — never a copy of the project. */
function ProjectPicker({
  selected,
  options,
  title,
  hint,
  emptyText,
  saveLabel,
  action,
}: {
  selected: ProjectOption[];
  options: ProjectOption[];
  title: string;
  hint: string;
  emptyText: string;
  saveLabel: string;
  action: (ids: string[]) => Promise<ActionResult<unknown>>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [picked, setPicked] = useState(selected);
  const available = options.filter((option) => !picked.some((p) => p.id === option.id));

  const move = (index: number, delta: -1 | 1) =>
    setPicked((list) => {
      const next = [...list];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  const save = () =>
    startTransition(async () => {
      const result = await action(picked.map((project) => project.id));
      if (result.ok) toast.success("Saved");
      else toast.error(result.error);
      router.refresh();
    });

  return (
    <div data-tour="picker"><SectionCard title={title} hint={hint}>
      {picked.length === 0 && <p className="text-sm text-muted-foreground">{emptyText}</p>}
      <ul className="flex flex-col gap-2">
        {picked.map((project, index) => (
          <li key={project.id} className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <div className="flex">
              <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up" title="Move up"><ArrowUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === picked.length - 1} onClick={() => move(index, 1)} aria-label="Move down" title="Move down"><ArrowDown className="size-4" /></Button>
            </div>
            {project.coverImage && <MediaPreview url={project.coverImage} className="h-10 w-16" />}
            <span className="flex-1 text-sm font-medium">{project.name.en}</span>
            {project.status !== "published" && <StatusBadge status={project.status} />}
            <Button type="button" variant="ghost" size="icon" onClick={() => setPicked((list) => list.filter((p) => p.id !== project.id))} aria-label="Remove" title="Remove"><X className="size-4" /></Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        {available.length > 0 && (
          <Select value="" onValueChange={(id) => setPicked((list) => [...list, options.find((option) => option.id === id)!])}>
            <SelectTrigger className="w-72"><Plus className="size-4" /><SelectValue placeholder="Add a project…" /></SelectTrigger>
            <SelectContent>
              {available.map((option) => <SelectItem key={option.id} value={option.id}>{option.name.en}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Button type="button" onClick={save} disabled={pending}>{pending ? "Saving…" : saveLabel}</Button>
      </div>
    </SectionCard></div>
  );
}

const LATEST = "latest";

export function MainPostPicker({ postId, options }: { postId: string | null; options: { id: string; title: Localized }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(postId ?? LATEST);

  const save = () =>
    startTransition(async () => {
      const result = await saveMainPost(value === LATEST ? null : value);
      if (result.ok) toast.success("Main item saved");
      else toast.error(result.error);
      router.refresh();
    });

  return (
    <div data-tour="picker"><SectionCard title="Main item" hint="Always first on page 1 of the Media Center. Only published posts can be pinned.">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full max-w-xl"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={LATEST}>Automatic — latest published</SelectItem>
          {options.map((option) => <SelectItem key={option.id} value={option.id}>{option.title.en}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button type="button" onClick={save} disabled={pending} className="w-fit">{pending ? "Saving…" : "Save main item"}</Button>
    </SectionCard></div>
  );
}
