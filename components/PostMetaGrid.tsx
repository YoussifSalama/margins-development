export default function PostMetaGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-7.5">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2.5">
          <p className="font-heading text-[20px] tracking-[0.6px] text-dark">{item.label}</p>
          <p className="text-[18px] font-medium tracking-[-0.54px] text-accent">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
