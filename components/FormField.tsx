type Option = string | { value: string; label: string };
type BaseProps = { label: string; placeholder: string; name?: string; required?: boolean };
type Props =
  | (BaseProps & { as?: "input"; type?: string })
  | (BaseProps & { as: "textarea" })
  | (BaseProps & { as: "select"; options: Option[] });

const fieldClass =
  "w-full border-b border-field-border bg-transparent pb-3 text-[16px] text-white outline-none transition-colors placeholder:text-placeholder hover:border-accent/60 focus:border-accent";

export default function FormField(props: Props) {
  const { label, placeholder, name, required } = props;

  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[14px] leading-5 font-medium text-white">{label}</span>
      {props.as === "textarea" ? (
        <textarea name={name} required={required} placeholder={placeholder} rows={3} className={`${fieldClass} resize-none`} />
      ) : props.as === "select" ? (
        <select name={name} required={required} defaultValue="" className={`${fieldClass} cursor-pointer`}>
          <option value="" disabled className="bg-background text-placeholder">
            {placeholder}
          </option>
          {props.options.map((option) => {
            const { value, label: text } = typeof option === "string" ? { value: option, label: option } : option;
            return (
              <option key={value} value={value} className="bg-background text-foreground">
                {text}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          name={name}
          required={required}
          type={props.type ?? "text"}
          placeholder={placeholder}
          dir={props.type === "email" || props.type === "tel" ? "ltr" : undefined}
          className={fieldClass}
        />
      )}
    </label>
  );
}
