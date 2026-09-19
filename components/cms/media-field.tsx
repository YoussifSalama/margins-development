"use client";

import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { signMediaUpload } from "@/server/storage/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FieldLabel } from "./fields";

/** Uploads straight to R2 via a presigned URL; returns the public URL or null. */
export async function uploadMedia(file: File) {
  const signed = await signMediaUpload({ contentType: file.type, size: file.size });
  if (!signed.ok) {
    toast.error(signed.error);
    return null;
  }
  const response = await fetch(signed.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!response.ok) {
    toast.error("Upload failed. Try again.");
    return null;
  }
  return signed.url;
}

export function MediaPreview({ url, className = "h-24 w-36" }: { url: string; className?: string }) {
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return <video src={url} muted className={`${className} rounded-md border object-cover`} />;
  // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary hosts
  return <img src={url} alt="" className={`${className} rounded-md border object-cover`} />;
}

export default function MediaField({
  name,
  label,
  hint,
  help,
  accept = "image/*",
}: {
  name: string;
  label: string;
  hint?: string;
  help?: string;
  accept?: string;
}) {
  const { control, setValue, register } = useFormContext();
  const url = useWatch({ control, name }) as string | null | undefined;
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const uploaded = await uploadMedia(file);
    if (uploaded) setValue(name, uploaded, { shouldDirty: true, shouldValidate: true });
    setUploading(false);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel name={name} label={label} help={help} />
      <div className="flex items-start gap-3">
        {url ? <MediaPreview url={url} /> : <div className="flex h-24 w-36 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">No file</div>}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <input ref={input} type="file" accept={accept} hidden onChange={(e) => onFile(e.target.files?.[0])} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
              <Upload className="size-4" />
              {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
            </Button>
            {url && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setValue(name, "", { shouldDirty: true })}>
                <X className="size-4" />
                Remove
              </Button>
            )}
          </div>
          <Input id={name} placeholder="…or paste a URL" dir="ltr" {...register(name)} />
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}
