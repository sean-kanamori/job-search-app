import { ResumesView } from "@/components/resumes-view";
import { showcaseResumes } from "@/lib/showcase-data";

export default function ShowcaseResumesPage() {
  return (
    <ResumesView
      templates={showcaseResumes}
      uploadHref={null}
      linkBase="/showcase/resumes"
    />
  );
}
