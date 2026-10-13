export default function TableOfContents({ title, headings }: { title: string; headings: { id: string; text: string }[] }) {
  if (headings.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-[20px] text-white">{title}</p>
      <ul className="flex flex-col gap-5 rounded-xl border border-white/15 p-5 text-[18px] tracking-[-0.54px] text-white/80">
        {headings.map((heading) => (
          <li key={heading.id} className="ms-6.75 list-disc">
            <a href={`#${heading.id}`} className="hover:text-accent">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
