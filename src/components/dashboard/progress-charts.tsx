'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList, Pie, PieChart, Cell, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const subjectMasteryData = [
  { subject: 'Math', mastery: 85, fill: 'var(--color-math)' },
  { subject: 'History', mastery: 72, fill: 'var(--color-history)' },
  { subject: 'Science', mastery: 91, fill: 'var(--color-science)' },
  { subject: 'Literature', mastery: 65, fill: 'var(--color-literature)' },
  { subject: 'Coding', mastery: 78, fill: 'var(--color-coding)' },
];

const subjectMasteryChartConfig = {
  mastery: {
    label: 'Mastery',
  },
  math: {
    label: 'Math',
    color: 'hsl(var(--chart-1))',
  },
  history: {
    label: 'History',
    color: 'hsl(var(--chart-2))',
  },
  science: {
    label: 'Science',
    color: 'hsl(var(--chart-3))',
  },
  literature: {
    label: 'Literature',
    color: 'hsl(var(--chart-4))',
  },
  coding: {
    label: 'Coding',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const weeklyStudyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 4 },
    { day: 'Thu', hours: 2 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 6 },
    { day: 'Sun', hours: 3.5 },
];

const weeklyStudyChartConfig = {
    hours: {
        label: "Study Hours",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

const quizScoresData = [
  { name: '80-100%', value: 12, fill: 'hsl(var(--chart-3))' },
  { name: '60-79%', value: 8, fill: 'hsl(var(--chart-2))' },
  { name: 'Below 60%', value: 3, fill: 'hsl(var(--destructive))' },
];

const quizScoresChartConfig = {
    scores: {
        label: "Quiz Scores"
    }
} satisfies ChartConfig


export function ProgressCharts() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Subject Mastery (%)</h3>
            <ChartContainer config={subjectMasteryChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={subjectMasteryData} margin={{ top: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="subject"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis domain={[0, 100]} hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="mastery" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-4">Weekly Study Hours</h3>
            <ChartContainer config={weeklyStudyChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={weeklyStudyData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--chart-1))" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quiz Score Distribution</h3>
            <ChartContainer config={quizScoresChartConfig} className="h-[250px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie
                        data={quizScoresData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor="middle" dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}
                    >
                        {quizScoresData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ChartContainer>
        </div>
    </div>
  );
}
