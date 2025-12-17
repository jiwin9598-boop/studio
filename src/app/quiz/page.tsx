import { QuizClient } from '@/components/quiz/quiz-client';

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Adaptive Quiz Generator
        </h1>
        <p className="text-muted-foreground">
          Challenge yourself with a quiz tailored to your knowledge level.
        </p>
      </div>
      <QuizClient />
    </div>
  );
}
