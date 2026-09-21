"use client";

import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { signMediaUpload } from "@/server/storage/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FieldError, FieldLabel } from "./fields";

/** PUTs straight to R2 via a presigned URL, reporting upload progress (0-100) as it goes. */
function putWithProgress(url: string, file: File, onProgress?: (pct: number) => void) {
  return new Promise<boolean>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
    xhr.onerror = () => resolve(false);
    xhr.send(file);
  });
}

// Warns on tab close/refresh while any upload is in flight (shared across every field on the page).
let activeUploads = 0;
const warnBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

/** Uploads straight to R2 via a presigned URL; returns the public URL or null. */
export async function uploadMedia(file: File, onProgress?: (pct: number) => void) {
  const signed = await signMediaUpload({ contentType: file.type, size: file.size });
  if (!signed.ok) {
    toast.error(signed.error);
    return null;
  }
  if (activeUploads++ === 0) window.addEventListener("beforeunload", warnBeforeUnload);
  const ok = await putWithProgress(signed.uploadUrl, file, onProgress);
  if (--activeUploads === 0) window.removeEventListener("beforeunload", warnBeforeUnload);
  if (!ok) {
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
  const [progress, setProgress] = useState<number | null>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setProgress(0);
    const uploaded = await uploadMedia(file, setProgress);
    if (uploaded) setValue(name, uploaded, { shouldDirty: true, shouldValidate: true });
    setProgress(null);
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
            <Button type="button" variant="outline" size="sm" disabled={progress !== null} onClick={() => input.current?.click()}>
              <Upload className="size-4" />
              {progress !== null ? `Uploading… ${progress}%` : url ? "Replace" : "Upload"}
            </Button>
            {url && progress === null && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setValue(name, "", { shouldDirty: true })}>
                <X className="size-4" />
                Remove
              </Button>
            )}
          </div>
          {progress !== null && <Progress value={progress} className="h-1.5" />}
          <Input id={name} placeholder="…or paste a URL" dir="ltr" {...register(name)} />
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}
