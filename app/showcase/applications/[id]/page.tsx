import { notFound } from "next/navigation";
import { ApplicationReadonly } from "@/components/application-readonly";
import { getShowcaseApplication, showcaseResumes } from "@/lib/showcase-data";

export default async function ShowcaseApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = getShowcaseApplication(id);
  if (!application) notFound();

  const resumeName =
    showcaseResumes.find((r) => r.id === application.resume_template_id)
      ?.name ?? null;

  return (
    <ApplicationReadonly application={application} resumeName={resumeName} />
  );
}
