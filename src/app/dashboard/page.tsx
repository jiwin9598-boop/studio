import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressCharts } from '@/components/dashboard/progress-charts';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Welcome back, Student!
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your learning journey. Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressCharts />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
