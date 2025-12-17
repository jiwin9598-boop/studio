'use server';

/**
 * @fileOverview Generates a personalized study plan based on exam dates, subjects,
 * and available study time, prioritizing topics based on difficulty and importance.
 *
 * - generatePersonalizedStudyPlan - A function that generates the study plan.
 * - GeneratePersonalizedStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - GeneratePersonalizedStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedStudyPlanInputSchema = z.object({
  examDate: z.string().describe('The date of the exam (YYYY-MM-DD).'),
  subjects: z.array(z.string()).describe('A list of subjects to study.'),
  availableStudyTime: z
    .number()
    .describe(
      'The number of hours available per day for studying, e.g. 2.5 for 2 hours and 30 minutes.'
    ),
  studentLevel: z
    .string()
    .describe(
      'The student level for study plan generation. For example, college or high school.'
    ),
});
export type GeneratePersonalizedStudyPlanInput = z.infer<
  typeof GeneratePersonalizedStudyPlanInputSchema
>;

const GeneratePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A detailed study plan including prioritized topics and schedule.'),
});
export type GeneratePersonalizedStudyPlanOutput = z.infer<
  typeof GeneratePersonalizedStudyPlanOutputSchema
>;

export async function generatePersonalizedStudyPlan(
  input: GeneratePersonalizedStudyPlanInput
): Promise<GeneratePersonalizedStudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: GeneratePersonalizedStudyPlanInputSchema},
  output: {schema: GeneratePersonalizedStudyPlanOutputSchema},
  prompt: `You are an expert study plan generator for {{{studentLevel}}} students. Create a personalized study plan for the following:

Exam Date: {{{examDate}}}
Subjects: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Available Study Time (hours per day): {{{availableStudyTime}}}

Prioritize topics based on their difficulty and importance for the exam. The study plan should include a detailed schedule.
Consider student level, exam date and study time to give back an efficient study plan. Do not assume topics, instead, derive them from given subjects.
Ensure that the study plan will include all the subjects.
Output the plan in markdown format.
`,
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GeneratePersonalizedStudyPlanInputSchema,
    outputSchema: GeneratePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
