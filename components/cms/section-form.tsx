"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, emptyValue, type FieldDef } from "@/lib/cms/fields";
import { getSection } from "@/lib/cms/pages";
import { saveSection } from "@/server/pages/actions";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./page-shell";
import { BilingualField, DateField, Field, FieldError, Legend, NumberField, SelectField, handleResult } from "./fields";
import { fieldHelp } from "@/lib/cms/help";
import HelpHint from "./help-hint";
import { BilingualListField, MediaListField } from "./list-fields";
import BilingualRichText from "./rich-text";
import MediaField from "./media-field";
import Repeater from "./repeater";

function MultiChoice({ name, field }: { name: string; field: Extract<FieldDef, { kind: "choice" }> }) {
  const { control } = useFormContext();
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Legend name={name} label={field.label} help={field.help} />
      <Controller
        control={control}
        name={name}
        render={({ field: input }) => (
          <div className="flex flex-wrap gap-2">
            {field.options.map((option) => {
              const selected = (input.value as string[]).includes(option.value);
              return (
                <label key={option.value} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--gold)]"
                    checked={selected}
                    onChange={() => input.onChange(selected ? input.value.filter((v: string) => v !== option.value) : [...input.value, option.value])}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        )}
      />
      <FieldError name={name} />
    </fieldset>
  );
}

export type DynamicOptions = Partial<Record<"postCategories", { value: string; label: string }[]>>;

function RenderField({ field, prefix = "", dynamic }: { field: FieldDef; prefix?: string; dynamic: DynamicOptions }) {
  const name = `${prefix}${field.name}`;
  switch (field.kind) {
    case "text":
      return <BilingualField name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "textarea":
      return <BilingualField name={name} label={field.label} hint={field.hint} help={field.help} multiline rows={4} />;
    case "rich":
      return <BilingualRichText name={name} label={field.label} hint={field.hint} help={field.help} basic={field.basic} />;
    case "plain":
      return <Field name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "media":
      return <MediaField name={name} label={field.label} hint={field.hint} help={field.help} accept={field.accept} />;
    case "mediaList":
      return <MediaListField name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "list":
      return <BilingualListField name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "number":
      return <NumberField name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "date":
      return <DateField name={name} label={field.label} hint={field.hint} help={field.help} />;
    case "choice":
      if (field.dynamic) return <MultiChoice name={name} field={{ ...field, options: dynamic[field.dynamic] ?? [] }} />;
      return field.multiple ? <MultiChoice name={name} field={field} /> : <SelectField name={name} label={field.label} hint={field.hint} help={field.help} options={field.options} />;
    case "items":
      return (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-sm font-medium">{field.label}<HelpHint text={field.help ?? fieldHelp(name)} /></p>
          <Repeater name={name} itemLabel={field.itemLabel} empty={emptyValue(field.fields)}>
            {(path) => field.fields.map((child) => <RenderField key={child.name} field={child} prefix={`${path}.`} dynamic={dynamic} />)}
          </Repeater>
        </div>
      );
  }
}

/** One section = one form = one save, like a page part in the old dashboard. */
export default function SectionForm({ page, section, values, readOnly, dynamic = {} }: { page: string; section: string; values: Record<string, unknown>; readOnly?: boolean; dynamic?: DynamicOptions }) {
  const def = getSection(page, section)!;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm({ resolver: zodResolver(buildSchema(def.fields)), defaultValues: values });

  if (def.fields.length === 0) return null;

  const submit = form.handleSubmit((data) =>
    startTransition(async () => {
      if (handleResult(form, await saveSection({ page, section, data }), `${def.label} saved`)) router.refresh();
    }),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} data-tour="section-form">
        <SectionCard title={def.label} hint={def.hint}>
          <fieldset disabled={readOnly} className="flex flex-col gap-5">
            {def.fields.map((field) => <RenderField key={field.name} field={field} dynamic={dynamic} />)}
          </fieldset>
          {readOnly ? (
            <p className="text-sm text-muted-foreground">Only admins can edit this section.</p>
          ) : (
            <div className="flex items-center gap-3">
              <Button type="submit" data-tour="save-section" disabled={pending}>{pending ? "Saving…" : "Save section"}</Button>
              {form.formState.isDirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
            </div>
          )}
        </SectionCard>
      </form>
    </FormProvider>
  );
}
