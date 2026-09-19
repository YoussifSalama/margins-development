"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "./fields";

/** Ordered, repeatable group of fields. Order on screen = order on the website. */
export default function Repeater({
  name,
  itemLabel,
  empty,
  children,
}: {
  name: string;
  itemLabel: string;
  empty: Record<string, unknown>;
  children: (path: string, index: number) => React.ReactNode;
}) {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-4 rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">{itemLabel} {index + 1}</p>
            <div className="flex items-center">
              <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Move up" title="Move up"><ArrowUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)} aria-label="Move down" title="Move down"><ArrowDown className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => remove(index)} aria-label={`Remove ${itemLabel}`} title="Remove"><Trash2 className="size-4" /></Button>
            </div>
          </div>
          {children(`${name}.${index}`, index)}
        </div>
      ))}
      <Button type="button" variant="outline" className="w-fit" onClick={() => append(structuredClone(empty))}>
        <Plus className="size-4" />
        Add {itemLabel.toLowerCase()}
      </Button>
      <FieldError name={name} />
    </div>
  );
}
