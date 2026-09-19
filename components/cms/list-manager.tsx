"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/schemas/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleResult } from "./fields";

// Shared by the small ordered lists (FAQs, partners, lookups): same lifecycle —
// add / edit in a dialog, reorder, delete — only the fields differ.
export default function ListManager<Item extends { id: string }, Values extends FieldValues>({
  noun,
  items,
  schema,
  empty,
  toValues,
  renderRow,
  fields,
  save,
  remove,
  reorder,
  sortable = true,
}: {
  noun: string;
  items: Item[];
  schema: z.ZodType<Values, Values>;
  empty: Values;
  toValues: (item: Item) => Values;
  renderRow: (item: Item) => React.ReactNode;
  fields: React.ReactNode;
  save: (input: Values & { id?: string }) => Promise<ActionResult<unknown>>;
  remove: (id: string) => Promise<ActionResult<unknown>>;
  reorder?: (ids: string[]) => Promise<ActionResult<unknown>>;
  sortable?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: empty as DefaultValues<Values> });

  const open = (target: Item | "new") => {
    form.reset(target === "new" ? empty : toValues(target));
    setEditing(target);
  };

  const submit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = await save({ ...values, id: editing && editing !== "new" ? editing.id : undefined });
      if (handleResult(form, result)) {
        setEditing(null);
        router.refresh();
      }
    }),
  );

  const move = (index: number, delta: -1 | 1) =>
    startTransition(async () => {
      const ids = items.map((item) => item.id);
      [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
      if (!reorder) return;
      const result = await reorder(ids);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  const confirmDelete = () =>
    startTransition(async () => {
      if (!deleting) return;
      const result = await remove(deleting.id);
      if (result.ok) toast.success(`${noun} deleted`);
      else toast.error(result.error);
      setDeleting(null);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button data-tour="add" onClick={() => open("new")}>
          <Plus className="size-4" />
          Add {noun.toLowerCase()}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No {noun.toLowerCase()}s yet.
        </div>
      ) : (
        <ul data-tour="list" className="flex flex-col divide-y rounded-xl border bg-card">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 p-4">
              {sortable && <div className="flex flex-col">
                <Button variant="ghost" size="icon" className="size-6" disabled={pending || index === 0} onClick={() => move(index, -1)} aria-label="Move up" title="Move up">
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-6" disabled={pending || index === items.length - 1} onClick={() => move(index, 1)} aria-label="Move down" title="Move down">
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>}
              <div className="min-w-0 flex-1">{renderRow(item)}</div>
              <Button variant="ghost" size="icon" onClick={() => open(item)} aria-label={`Edit ${noun}`} title="Edit">
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleting(item)} aria-label={`Delete ${noun}`} title="Delete" className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onOpenChange={(next) => !next && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? `Add ${noun.toLowerCase()}` : `Edit ${noun.toLowerCase()}`}</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={submit} className="flex flex-col gap-5">
              {fields}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(next) => !next && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This removes it from every page that shows it. It can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
