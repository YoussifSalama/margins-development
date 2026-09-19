// CMS rich text (descriptions, article bodies). The HTML is sanitised on save in the CMS
// (server/html.ts) against a fixed allow-list, which is what makes rendering it here safe.
// Plain text passes through untouched, so a field that isn't rich yet still renders.
export default function RichText({ html, className = "", as: Tag = "div" }: { html: string; className?: string; as?: "div" | "span" }) {
  if (!html) return null;
  return <Tag className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
