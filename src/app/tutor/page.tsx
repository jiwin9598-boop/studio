import { TutorClient } from "@/components/tutor/tutor-client";

export default function TutorPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          AI Tutor
        </h1>
        <p className="text-muted-foreground">
          Ask anything! Your personal tutor is here to help you understand
          complex subjects.
        </p>
      </div>
      <TutorClient />
    </div>
  );
}
