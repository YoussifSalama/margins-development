type BaseProps = { label: string; placeholder: string };
type Props =
  | (BaseProps & { as?: "input"; type?: string })
  | (BaseProps & { as: "textarea" })
  | (BaseProps & { as: "select"; options: string[] });

const fieldClass =
  "w-full border-b border-field-border bg-transparent pb-3 text-[16px] text-white outline-none transition-colors placeholder:text-placeholder hover:border-accent/60 focus:border-accent";

export default function FormField(props: Props) {
  const { label, placeholder } = props;

  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[14px] leading-5 font-medium text-white">{label}</span>
      {props.as === "textarea" ? (
        <textarea placeholder={placeholder} rows={3} className={`${fieldClass} resize-none`} />
      ) : props.as === "select" ? (
        <select defaultValue="" className={`${fieldClass} cursor-pointer`}>
          <option value="" disabled className="bg-background text-placeholder">
            {placeholder}
          </option>
          {props.options.map((option) => (
            <option key={option} value={option} className="bg-background text-foreground">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={props.type ?? "text"}
          placeholder={placeholder}
          dir={props.type === "email" || props.type === "tel" ? "ltr" : undefined}
          className={fieldClass}
        />
      )}
    </label>
  );
}
