"use client";

import { useFormContext } from "react-hook-form";
import ListManager from "@/components/cms/list-manager";
import { Field, SelectField } from "@/components/cms/fields";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { userInput, type UserInput } from "@/lib/schemas/user";
import { deleteUser, saveUser } from "@/server/users/actions";

type User = { id: string; name: string; email: string; role: "admin" | "editor" };

function Fields() {
  const { register } = useFormContext<UserInput>();
  return (
    <>
      <Field name="name" label="Name" />
      <Field name="email" label="Email"><Input id="email" type="email" dir="ltr" {...register("email")} /></Field>
      <SelectField name="role" label="Role" options={[{ value: "editor", label: "Editor" }, { value: "admin", label: "Admin" }]} />
      <Field name="password" label="Password" hint="At least 10 characters. Leave empty when editing to keep the current one; setting a new one signs the user out everywhere.">
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
      </Field>
    </>
  );
}

export default function UsersManager({ items, meId }: { items: User[]; meId: string }) {
  return (
    <ListManager<User, UserInput>
      noun="User"
      items={items}
      sortable={false}
      schema={userInput}
      empty={{ name: "", email: "", role: "editor", password: "" }}
      toValues={({ name, email, role }) => ({ name, email, role, password: "" })}
      renderRow={(user) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}{user.id === meId && " (you)"}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">{user.role}</Badge>
        </div>
      )}
      fields={<Fields />}
      save={saveUser}
      remove={deleteUser}
    />
  );
}
