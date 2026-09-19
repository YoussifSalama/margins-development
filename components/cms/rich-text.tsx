"use client";

import { useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { plainToHtml } from "@/lib/cms/fields";
import { uploadMedia } from "./media-field";
import { FieldError, Legend } from "./fields";

function ToolbarButton({ active, onClick, label, children }: { active?: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("flex size-8 items-center justify-center rounded-md hover:bg-muted", active && "bg-primary text-primary-foreground hover:bg-primary")}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, basic }: { editor: Editor; basic?: boolean }) {
  const file = useRef<HTMLInputElement>(null);
  const chain = () => editor.chain().focus();

  const setLink = () => {
    const url = window.prompt("Link URL (empty to remove)", editor.getAttributes("link").href ?? "https://");
    if (url === null) return;
    if (url === "") chain().unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b p-1.5">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
      {!basic && <ToolbarButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></ToolbarButton>}
      {!basic && <ToolbarButton label="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></ToolbarButton>}
      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
      {!basic && <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>}
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}><Link2 className="size-4" /></ToolbarButton>
      {!basic && <ToolbarButton label="Insert image" onClick={() => file.current?.click()}><ImagePlus className="size-4" /></ToolbarButton>}
      <input
        ref={file}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const picked = e.target.files?.[0];
          e.target.value = "";
          const url = picked && (await uploadMedia(picked));
          if (url) chain().setImage({ src: url }).run();
        }}
      />
    </div>
  );
}

function RichTextEditor({ name, dir, basic }: { name: string; dir: "ltr" | "rtl"; basic?: boolean }) {
  const { control } = useFormContext();
  const { field } = useController({ control, name });

  const editor = useEditor({
    extensions: basic
      ? [StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, horizontalRule: false, link: { openOnClick: false } })]
      : [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), Image],
    // values saved before a field became rich text are plain strings
    content: plainToHtml(field.value ?? ""),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        dir,
        class: cn(
          basic ? "min-h-28" : "min-h-64",
          "px-4 py-3 text-sm leading-6 outline-none [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:ps-6 [&_blockquote]:border-s-2 [&_blockquote]:ps-3 [&_a]:underline [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-md",
          dir === "rtl" && "font-[family-name:var(--font-alexandria)]",
        ),
      },
    },
    onUpdate: ({ editor }) => field.onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring/50">
      {editor && <Toolbar editor={editor} basic={basic} />}
      <EditorContent editor={editor} />
    </div>
  );
}

/** Full mode: headings (H2) become the table of contents on the public page. Basic mode: inline formatting, lists and links only. */
export default function BilingualRichText({ name, label, hint, help, basic }: { name: string; label: string; hint?: string; help?: string; basic?: boolean }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Legend name={name} label={label} help={help} />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {(["en", "ar"] as const).map((locale) => (
          <div key={locale} className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">{locale === "en" ? "English" : "العربية"}</p>
            <RichTextEditor name={`${name}.${locale}`} dir={locale === "ar" ? "rtl" : "ltr"} basic={basic} />
            <FieldError name={`${name}.${locale}`} />
          </div>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </fieldset>
  );
}
