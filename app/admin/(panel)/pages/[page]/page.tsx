import SectionEditorPage from "@/components/cms/section-editor-page";

export default async function Page({ params }: PageProps<"/admin/pages/[page]">) {
  const { page } = await params;
  return <SectionEditorPage group="pages" page={page} />;
}
