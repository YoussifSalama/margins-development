"use client";

import { useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaPreview, uploadMedia } from "./media-field";
import { FieldError, Legend } from "./fields";
import { fieldHelp } from "@/lib/cms/help";
import HelpHint from "./help-hint";

const toLines = (value: string[] | undefined) => (value ?? []).join("\n");
const fromLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

/** string[] per language, edited as one item per line. */
export function BilingualListField({ name, label, hint, help, rows = 5 }: { name: string; label: string; hint?: string; help?: string; rows?: number }) {
  const { control } = useFormContext();
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Legend name={name} label={label} help={help} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(["en", "ar"] as const).map((locale) => (
          <Controller
            key={locale}
            control={control}
            name={`${name}.${locale}`}
            render={({ field }) => (
              // uncontrolled so blank lines survive while typing; parsed on blur
              <Textarea
                aria-label={`${label} (${locale})`}
                dir={locale === "ar" ? "rtl" : "ltr"}
                placeholder={locale === "en" ? "English — one per line" : "العربية — سطر لكل عنصر"}
                rows={rows}
                defaultValue={toLines(field.value)}
                onBlur={(e) => field.onChange(fromLines(e.target.value))}
                className={locale === "ar" ? "font-[family-name:var(--font-alexandria)]" : undefined}
              />
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{hint ?? "One item per line."}</p>
      <FieldError name={name} />
    </fieldset>
  );
}

/** Ordered list of uploaded files (gallery, story images). */
export function MediaListField({ name, label, hint, help }: { name: string; label: string; hint?: string; help?: string }) {
  const { control, setValue } = useFormContext();
  const urls = (useWatch({ control, name }) as string[] | undefined) ?? [];
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded = (await Promise.all([...files].map(uploadMedia))).filter((url): url is string => Boolean(url));
    setValue(name, [...urls, ...uploaded], { shouldDirty: true });
    setUploading(false);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-sm font-medium">{label}<HelpHint text={help ?? fieldHelp(name)} /></p>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative">
            <MediaPreview url={url} />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => setValue(name, urls.filter((_, i) => i !== index), { shouldDirty: true })}
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
        <Button type="button" variant="outline" className="h-24 w-36 flex-col" disabled={uploading} onClick={() => input.current?.click()}>
          <Upload className="size-4" />
          {uploading ? "Uploading…" : "Add images"}
        </Button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
