import { Navbar } from "@/components/navbar";
import { ProjectView } from "@/components/project-view";
import { getProjectById } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the project data
  const project = await getProjectById(params.id);

  // If the project is not found, return a 404 page
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-8">
        <ProjectView project={project} />
      </main>
    </div>
  );
}
