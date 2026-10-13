"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaFacebookF, FaXTwitter, FaLink } from "react-icons/fa6";

// ponytail: "#" until the real profile handle is given
const instagramHref = "https://instagram.com/marginsdevelopment";

const iconClass =
  "flex size-10 items-center justify-center rounded-full border border-accent text-accent hover:bg-accent hover:text-white";

export default function ShareLinks({
  label,
  title,
  copiedLabel,
}: {
  label: string;
  title: string;
  copiedLabel: string;
}) {
  // empty until mount so SSR/hydration render the same "#" hrefs — the real
  // page URL only exists client-side
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const facebookHref = url ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` : "#";
  const xHref = url
    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    : "#";

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ponytail: clipboard blocked (permissions/non-https) — nothing to recover, button just won't confirm
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-dark">{label}</p>
      <div className="flex items-center gap-4">
        <a href={instagramHref} target="_blank" rel="noopener noreferrer" className={iconClass}>
          <FaInstagram className="size-4" />
        </a>
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" className={iconClass}>
          <FaFacebookF className="size-4" />
        </a>
        <a href={xHref} target="_blank" rel="noopener noreferrer" className={iconClass}>
          <FaXTwitter className="size-4" />
        </a>
        <button type="button" onClick={copyLink} aria-label="Copy link" className={`relative ${iconClass}`}>
          <FaLink className="size-4" />
          {copied && (
            <span className="absolute -top-9 rounded-md bg-dark px-2 py-1 text-xs whitespace-nowrap text-white">
              {copiedLabel}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
