"use client";

import { useEffect } from "react";
import { Controller, get, useFormContext, type FieldValues, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/schemas/common";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fromLocalInput, toLocalInput } from "@/lib/dates";
import { fieldHelp } from "@/lib/cms/help";
import HelpHint from "./help-hint";

/** Warns on tab close/refresh while a form has unsaved changes. */
export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
}

export function FieldError({ name }: { name: string }) {
  const { formState } = useFormContext();
  const message = get(formState.errors, name)?.message as string | undefined;
  return message ? <p role="alert" className="text-xs text-destructive">{message}</p> : null;
}

/** Label + "?" tooltip. `help` overrides the dictionary lookup in lib/cms/help.ts. */
export function FieldLabel({ name, label, help }: { name: string; label: string; help?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <HelpHint text={help ?? fieldHelp(name)} />
    </div>
  );
}

export function Legend({ name, label, help }: { name: string; label: string; help?: string }) {
  return (
    <legend className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
      {label}
      <HelpHint text={help ?? fieldHelp(name)} />
    </legend>
  );
}

export function Field({
  name,
  label,
  hint,
  help,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  help?: string;
  children?: React.ReactNode;
}) {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel name={name} label={label} help={help} />
      {children ?? <Input id={name} {...register(name)} />}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}

/** One label, English and Arabic side by side, one error per language. */
export function BilingualField({
  name,
  label,
  hint,
  help,
  multiline,
  rows = 3,
}: {
  name: string;
  label: string;
  hint?: string;
  help?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const { register } = useFormContext();
  const Control = multiline ? Textarea : Input;
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Legend name={name} label={label} help={help} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Control aria-label={`${label} (English)`} placeholder="English" dir="ltr" rows={rows} {...register(`${name}.en`)} />
          <FieldError name={`${name}.en`} />
        </div>
        <div className="flex flex-col gap-1">
          <Control
            aria-label={`${label} (Arabic)`}
            placeholder="العربية"
            dir="rtl"
            rows={rows}
            className="font-[family-name:var(--font-alexandria)]"
            {...register(`${name}.ar`)}
          />
          <FieldError name={`${name}.ar`} />
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </fieldset>
  );
}

export function SelectField({ name, label, hint, help, options }: { name: string; label: string; hint?: string; help?: string; options: { value: string; label: string }[] }) {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel name={name} label={label} help={help} />
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={name} className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}

/** Stores ISO (UTC); shows and edits in the editor's own timezone. */
export function DateTimeField({ name, label, hint, help }: { name: string; label: string; hint?: string; help?: string }) {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel name={name} label={label} help={help} />
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input id={name} type="datetime-local" value={toLocalInput(field.value)} onChange={(e) => field.onChange(fromLocalInput(e.target.value))} />
        )}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}

export function NumberField({ name, label, hint, help, nullable }: { name: string; label: string; hint?: string; help?: string; nullable?: boolean }) {
  const { register } = useFormContext();
  return (
    <Field name={name} label={label} hint={hint} help={help}>
      <Input
        id={name}
        type="number"
        step="any"
        dir="ltr"
        {...register(name, { setValueAs: (value) => (value === "" || value === null ? (nullable ? null : 0) : Number(value)) })}
      />
    </Field>
  );
}

export function DateField({ name, label, hint, help }: { name: string; label: string; hint?: string; help?: string }) {
  const { register } = useFormContext();
  return (
    <Field name={name} label={label} hint={hint} help={help}>
      <Input id={name} type="date" {...register(name)} />
    </Field>
  );
}

/** Toasts the outcome and pins server-side validation errors onto their fields. */
export function handleResult<T extends FieldValues, R>(form: UseFormReturn<T>, result: ActionResult<R>, success = "Saved") {
  if (result.ok) {
    toast.success(success);
    form.reset(form.getValues());
    return true;
  }
  toast.error(result.error);
  for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
    form.setError(path as never, { message });
  }
  return false;
}
