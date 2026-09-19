"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { FiCheck, FiFileText, FiUploadCloud } from "react-icons/fi";
import { signCvUpload, submitApplication } from "@/server/inbox/public";
import { CV_ACCEPT, CV_MAX_BYTES, CV_TYPES } from "@/lib/schemas/inbox";

const fieldClass =
  "w-full rounded-xl bg-white/5 px-4 py-3.5 text-base text-white ring-1 ring-white/15 outline-none transition placeholder:text-white/40 focus:ring-2 focus:ring-accent";

// The application lands in the CMS under Inbox → Job applications, with the CV attached.
// The file goes from the browser straight to storage (a short-lived signed link); only its
// key travels through our server, together with a token proving we issued it.
export default function JobApplyForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const t = useTranslations("careers.applyForm");
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  function pickFile(picked: File | undefined) {
    setError(null);
    if (!picked) return setFile(null);
    // same rules the server enforces — checked here only to fail fast and kindly
    if (!CV_TYPES[picked.type]) return setError(t("errorType"));
    if (picked.size > CV_MAX_BYTES) return setError(t("errorSize"));
    setFile(picked);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setError(t("errorNoFile"));
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "");
    setError(null);

    try {
      setStatus("uploading");
      const signed = await signCvUpload({ contentType: file.type, size: file.size, website: value("website") });
      if (!signed.ok) throw new Error(signed.error === "rate" ? t("errorRate") : signed.error === "size" ? t("errorSize") : signed.error === "type" ? t("errorType") : t("errorUpload"));
      const upload = await fetch(signed.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!upload.ok) throw new Error(t("errorUpload"));

      setStatus("sending");
      const result = await submitApplication({
        jobSlug, name: value("name"), email: value("email"), phone: value("phone"), note: value("note"),
        cvKey: signed.key, cvToken: signed.token, website: value("website"),
      });
      if (!result.ok) throw new Error(t("errorSubmit"));
      setStatus("sent");
    } catch (caught) {
      setStatus("idle");
      setError(caught instanceof Error && caught.message ? caught.message : t("errorSubmit"));
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[32px] bg-job-dark p-8 sm:p-12">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent text-dark"><FiCheck className="size-6" /></span>
        <h2 className="font-heading text-3xl text-white">{t("sentHeading")}</h2>
        <p className="max-w-xl text-white/70">{t("sentBody", { job: jobTitle })}</p>
      </div>
    );
  }

  const busy = status !== "idle";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-[32px] bg-job-dark p-8 sm:p-12">
      <div>
        <h2 className="font-heading text-3xl text-accent">{t("heading")}</h2>
        <p className="mt-2 text-white/60">{t("intro", { job: jobTitle })}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          {t("name")}
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={fieldClass} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          {t("email")}
          <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" className={fieldClass} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          {t("phone")}
          <input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" dir="ltr" className={fieldClass} />
        </label>

        <div className="flex flex-col gap-2 text-sm font-medium text-white">
          <span id="cv-label">{t("cv")}</span>
          <input ref={fileInput} type="file" accept={CV_ACCEPT} hidden onChange={(e) => pickFile(e.target.files?.[0])} />
          <button
            type="button"
            aria-labelledby="cv-label"
            onClick={() => fileInput.current?.click()}
            className={`${fieldClass} flex items-center gap-3 text-start ${file ? "" : "text-white/50"}`}
          >
            {file ? <FiFileText className="size-5 shrink-0 text-accent" /> : <FiUploadCloud className="size-5 shrink-0" />}
            <span className="min-w-0 flex-1 truncate">{file ? file.name : t("cvPlaceholder")}</span>
            {file && <span className="shrink-0 text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(1)} MB</span>}
          </button>
          <span className="text-xs font-normal text-white/40">{t("cvHint")}</span>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-white">
        {t("note")}
        <textarea name="note" rows={4} maxLength={3000} placeholder={t("notePlaceholder")} className={`${fieldClass} resize-none`} />
      </label>

      {/* honeypot — hidden from people and assistive tech, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="flex min-h-14 items-center justify-center self-start rounded-full bg-accent px-10 text-base font-semibold tracking-wide text-[#121212] uppercase transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "uploading" ? t("uploading") : status === "sending" ? t("sending") : t("submit")}
      </button>
      <p className="text-xs text-white/40">{t("privacy")}</p>
    </form>
  );
}
