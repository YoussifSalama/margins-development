"use client";

import { Controller, useFormContext } from "react-hook-form";
import ListManager from "@/components/cms/list-manager";
import { BilingualField, FieldLabel } from "@/components/cms/fields";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { faqInput, type FaqInput } from "@/lib/schemas/lists";
import { emptyLocalized } from "@/lib/schemas/common";
import { deleteFaq, reorderFaqs, saveFaq } from "@/server/lists/actions";

type Faq = FaqInput & { id: string };

function Fields() {
  const { control } = useFormContext<FaqInput>();
  return (
    <>
      <BilingualField name="question" label="Question" />
      <BilingualField name="answer" label="Answer" multiline rows={5} />
      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch id="published" checked={field.value} onCheckedChange={field.onChange} />
            <FieldLabel name="published" label="Visible on the website" />
          </div>
        )}
      />
    </>
  );
}

export default function FaqsManager({ items }: { items: Faq[] }) {
  return (
    <ListManager<Faq, FaqInput>
      noun="FAQ"
      items={items}
      schema={faqInput}
      empty={{ question: emptyLocalized, answer: emptyLocalized, published: true }}
      toValues={({ question, answer, published }) => ({ question, answer, published })}
      renderRow={(faq) => (
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{faq.question.en}</p>
            <p dir="rtl" className="truncate text-sm text-muted-foreground">{faq.question.ar}</p>
          </div>
          {!faq.published && <Badge variant="secondary">Hidden</Badge>}
        </div>
      )}
      fields={<Fields />}
      save={saveFaq}
      remove={deleteFaq}
      reorder={reorderFaqs}
    />
  );
}
