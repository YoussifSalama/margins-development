import SectionEditorPage from "@/components/cms/section-editor-page";

export default async function Page({ params }: PageProps<"/admin/shared/[page]">) {
  const { page } = await params;
  return <SectionEditorPage group="shared" page={page} />;
}
