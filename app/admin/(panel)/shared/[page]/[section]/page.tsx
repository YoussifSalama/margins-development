import SectionEditorPage from "@/components/cms/section-editor-page";
import { pageDefs } from "@/lib/cms/pages";

export async function generateMetadata({ params }: PageProps<"/admin/shared/[page]/[section]">) {
  const { page, section } = await params;
  const def = pageDefs[page];
  return { title: def ? `${def.label} · ${def.sections[section]?.label ?? ""}` : "Not found" };
}

export default async function Page({ params }: PageProps<"/admin/shared/[page]/[section]">) {
  const { page, section } = await params;
  return <SectionEditorPage group="shared" page={page} section={section} />;
}
