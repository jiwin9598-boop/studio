import { PlannerClient } from '@/components/planner/planner-client';

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Study Plan Generator
        </h1>
        <p className="text-muted-foreground">
          Tell us about your goals, and we'll create a personalized study
          schedule for you.
        </p>
      </div>
      <PlannerClient />
    </div>
  );
}
