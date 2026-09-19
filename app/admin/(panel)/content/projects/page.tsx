import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell from "@/components/cms/page-shell";
import StatusBadge from "@/components/cms/status-badge";
import ReorderButtons from "@/components/cms/reorder-buttons";
import { MediaPreview } from "@/components/cms/media-field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listProjects } from "@/server/projects/queries";
import { reorderProjects } from "@/server/projects/actions";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await listProjects();
  const ids = projects.map((project) => project.id);

  return (
    <PageShell
      tour="list"
      eyebrow="Content"
      title="Projects"
      description="One record per development. The projects page, project pages, the Home showcase and the calculator all read from here. Order here = order on the Projects page."
      actions={<Button asChild><Link href="/admin/content/projects/new"><Plus className="size-4" />New project</Link></Button>}
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Construction</TableHead>
              <TableHead>Used in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No projects yet.</TableCell></TableRow>}
            {projects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell><ReorderButtons ids={ids} index={index} action={reorderProjects} /></TableCell>
                <TableCell>
                  <Link href={`/admin/content/projects/${project.id}`} className="flex items-center gap-3 hover:underline">
                    {project.coverImage && <MediaPreview url={project.coverImage} className="h-10 w-16" />}
                    <span>
                      <span className="block font-medium">{project.name.en}</span>
                      <span className="block text-sm text-muted-foreground">{project.location.en}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell><StatusBadge status={project.status} /></TableCell>
                <TableCell className="text-sm capitalize">{project.buildStatus.replaceAll("_", " ")}</TableCell>
                <TableCell className="space-x-1">
                  {project.onHome && <Badge variant="outline">Home showcase</Badge>}
                  {project.inCalculator && <Badge variant="outline">Calculator</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
