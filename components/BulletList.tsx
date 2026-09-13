export default function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-white/70">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
