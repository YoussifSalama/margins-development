"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { slugify, type ActionResult } from "@/lib/schemas/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, handleResult, useUnsavedChangesWarning } from "./fields";

/** Create/edit form for entities with their own page: sticky save bar, delete, redirect after create. */
export default function EntityForm<Values extends FieldValues>({
  noun,
  basePath,
  id,
  schema,
  values,
  save,
  remove,
  children,
}: {
  noun: string;
  basePath: string;
  id?: string;
  schema: z.ZodType<Values, Values>;
  values: Values;
  save: (input: Values & { id?: string }) => Promise<ActionResult<{ id: string }>>;
  remove?: (id: string) => Promise<ActionResult<unknown>>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: values as DefaultValues<Values> });
  useUnsavedChangesWarning(form.formState.isDirty);

  const submit = form.handleSubmit(
    (input) =>
      startTransition(async () => {
        const result = await save({ ...input, id });
        if (!handleResult(form, result) || !result.ok) return;
        if (id) router.refresh();
        else router.replace(`${basePath}/${result.data.id}`);
      }),
    () => toast.error("Some fields need attention — check every tab."),
  );

  const confirmDelete = () =>
    startTransition(async () => {
      if (!id || !remove) return;
      const result = await remove(id);
      if (!result.ok) return void toast.error(result.error);
      toast.success(`${noun} deleted`);
      router.replace(basePath);
    });

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} className="flex flex-col gap-6 pb-24">
        {children}
        <div data-tour="save-bar" className="fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 backdrop-blur lg:left-[260px]">
          <div className="flex items-center justify-between gap-3 px-6 py-3 lg:px-10">
            {id && remove ? (
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setConfirming(true)}>
                <Trash2 className="size-4" />
                Delete
              </Button>
            ) : <span />}
            <div className="flex items-center gap-3">
              {form.formState.isDirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
              <Button type="submit" disabled={pending}>{pending ? "Saving…" : id ? "Save changes" : `Create ${noun.toLowerCase()}`}</Button>
            </div>
          </div>
        </div>
      </form>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its page goes offline and it disappears from every page that references it. This can&apos;t be undone — consider archiving instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
}

/** Shared across languages. Auto-fills from the English title until the editor types their own. */
export function SlugField({ source, locked, prefix }: { source: string; locked?: boolean; prefix: string }) {
  const { register, getValues, setValue } = useFormContext();
  return (
    <Field
      name="slug"
      label="URL slug"
      hint={locked ? "Locked — this URL has been live and is kept stable for links and search engines." : `${prefix}<slug> — same in both languages.`}
    >
      <Input
        id="slug"
        dir="ltr"
        readOnly={locked}
        className={locked ? "bg-muted" : undefined}
        {...register("slug")}
        onFocus={() => {
          if (!locked && !getValues("slug")) setValue("slug", slugify(getValues(source) ?? ""), { shouldDirty: true });
        }}
      />
    </Field>
  );
}
