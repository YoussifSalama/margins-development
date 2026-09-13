export function headingId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function TableOfContents({ title, headings }: { title: string; headings: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-[20px] text-dark">{title}</p>
      <ul className="flex flex-col gap-5 rounded-xl border border-black/10 p-5 text-[18px] tracking-[-0.54px] text-toc-ink">
        {headings.map((heading) => (
          <li key={heading} className="ms-6.75 list-disc">
            <a href={`#${headingId(heading)}`} className="hover:text-accent">
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
