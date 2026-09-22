"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clearChatbotApiKey, saveChatbotSettings } from "@/server/chat/actions";

type Props = { hasEnvKey: boolean; hasDbKey: boolean; systemPrompt: string };

export default function ChatbotSettingsForm({ hasEnvKey, hasDbKey, systemPrompt: initialPrompt }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(initialPrompt);
  const [pending, startTransition] = useTransition();
  const [dbKeySet, setDbKeySet] = useState(hasDbKey);

  const save = () =>
    startTransition(async () => {
      const result = await saveChatbotSettings({ apiKey, systemPrompt });
      if (!result.ok) return void toast.error(result.error);
      if (apiKey) setDbKeySet(true);
      setApiKey("");
      toast.success("Saved");
    });

  const clearKey = () =>
    startTransition(async () => {
      const result = await clearChatbotApiKey({});
      if (!result.ok) return void toast.error(result.error);
      setDbKeySet(false);
      toast.success("Saved key removed");
    });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="apiKey">Gemini API key</Label>
        <Input
          id="apiKey"
          type="password"
          autoComplete="off"
          placeholder={hasEnvKey ? "Using GEMINI_API_KEY from the server environment" : dbKeySet ? "•••••••••••••••• (saved)" : "Not set — the assistant is offline"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Free at{" "}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline">
            aistudio.google.com/apikey
          </a>
          . Stored encrypted. {hasEnvKey ? "A server environment key is set and takes priority over this one." : "Leave blank to keep the current key."}
        </p>
        {dbKeySet && !hasEnvKey && (
          <Button type="button" variant="outline" size="sm" className="w-fit" disabled={pending} onClick={clearKey}>
            Remove saved key
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="systemPrompt">System prompt</Label>
        <Textarea
          id="systemPrompt"
          rows={6}
          placeholder="Leave blank to use the default instructions (answer from the FAQ list, stay on-topic, short replies)."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">Extra instructions the assistant follows, on top of the published FAQ list below.</p>
      </div>

      <Button type="button" disabled={pending} onClick={save} className="w-fit">
        {pending ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
