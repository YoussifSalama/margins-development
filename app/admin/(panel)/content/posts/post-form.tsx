"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import EntityForm, { SlugField } from "@/components/cms/entity-form";
import { SectionCard } from "@/components/cms/page-shell";
import { BilingualField, DateTimeField, Field, SelectField } from "@/components/cms/fields";
import BilingualRichText from "@/components/cms/rich-text";
import MediaField from "@/components/cms/media-field";
import { MediaListField } from "@/components/cms/list-fields";
import SeoFields from "@/components/cms/seo-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { makePostInput, type PostInput } from "@/lib/schemas/post";
import { deletePost, savePost } from "@/server/posts/actions";

export type CategoryOption = { id: string; key: string; name: string; kind: "news" | "article" | "event" };

function Fields({ slugLocked, categories }: { slugLocked: boolean; categories: CategoryOption[] }) {
  const categoryId = useWatch({ name: "categoryId" }) as string;
  const category = categories.find((option) => option.id === categoryId);
  const isEvent = category?.kind === "event";

  return (
    <Tabs defaultValue="content" className="gap-6">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        {isEvent && <TabsTrigger value="event">Event details</TabsTrigger>}
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="flex flex-col gap-6">
        <SectionCard title="Publishing">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SelectField name="categoryId" label="Category" options={categories.map((category) => ({ value: category.id, label: category.name }))} />
            <SelectField name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]} />
            <DateTimeField name="publishedAt" label="Publish date" hint="Empty = now. A future date schedules it." />
          </div>
        </SectionCard>
        <SectionCard title="Article">
          <BilingualField name="title" label="Title" />
          <SlugField source="title.en" locked={slugLocked} prefix={`/media/${category?.key ?? "…"}/`} />
          <BilingualField name="excerpt" label="Excerpt" multiline hint="Shown on cards and used as the default meta description." />
          <BilingualField name="authorLabel" label="Author" hint='e.g. "Margins Press Team"' />
          <BilingualRichText name="body" label="Body" hint="Use Heading for sections — they become the table of contents. Reading time is calculated automatically." />
        </SectionCard>
      </TabsContent>

      {isEvent && (
        <TabsContent value="event">
          <SectionCard title="Event details" hint="Drives the Upcoming / Past label and the Event structured data.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DateTimeField name="startsAt" label="Starts" />
              <DateTimeField name="endsAt" label="Ends (optional)" />
            </div>
            <BilingualField name="venue" label="Venue" />
            <Field name="registrationUrl" label="Registration link (optional)" />
          </SectionCard>
        </TabsContent>
      )}

      <TabsContent value="media">
        <SectionCard title="Media">
          <MediaField name="coverImage" label="Cover image" hint="Required to publish. Used on cards, the article hero and social shares." />
          <MediaListField name="gallery" label="Gallery" />
        </SectionCard>
      </TabsContent>

      <TabsContent value="seo">
        <SeoFields fallback="the title and excerpt" />
      </TabsContent>
    </Tabs>
  );
}

export default function PostForm({ id, values, slugLocked = false, categories }: { id?: string; values: PostInput; slugLocked?: boolean; categories: CategoryOption[] }) {
  // event rules depend on which categories are events → schema built from the list we were given
  const schema = useMemo(() => makePostInput(categories.filter((c) => c.kind === "event").map((c) => c.id)), [categories]);
  return (
    <EntityForm<PostInput>
      noun="Post"
      basePath="/admin/content/posts"
      id={id}
      schema={schema}
      values={values}
      save={savePost}
      remove={deletePost}
    >
      <Fields slugLocked={slugLocked} categories={categories} />
    </EntityForm>
  );
}
