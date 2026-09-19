"use client";

import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SectionCard } from "@/components/cms/page-shell";
import { Field, handleResult } from "@/components/cms/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeOwnPassword } from "@/server/users/actions";

export default function PasswordForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm({ defaultValues: { password: "" } });

  const submit = form.handleSubmit((values) =>
    startTransition(async () => {
      if (handleResult(form, await changeOwnPassword(values), "Password changed")) form.reset({ password: "" });
    }),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} className="max-w-md">
        <SectionCard title="Change password">
          <Field name="password" label="New password" hint="At least 10 characters.">
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          </Field>
          <Button type="submit" disabled={pending} className="w-fit">{pending ? "Saving…" : "Change password"}</Button>
        </SectionCard>
      </form>
    </FormProvider>
  );
}
