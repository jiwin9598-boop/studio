'use server';

/**
 * @fileOverview Provides personalized study assistance by answering questions and explaining concepts with reasoning.
 *
 * - getPersonalizedTutoring - A function that handles the personalized tutoring process.
 * - GetPersonalizedTutoringInput - The input type for the getPersonalizedTutoring function.
 * - GetPersonalizedTutoringOutput - The return type for the getPersonalizedTutoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPersonalizedTutoringInputSchema = z.object({
  topic: z.string().describe('The complex topic the student needs help with.'),
  question: z.string().describe('The specific question the student has about the topic.'),
  studentLevel: z.string().describe('The current academic level of the student.'),
});
export type GetPersonalizedTutoringInput = z.infer<typeof GetPersonalizedTutoringInputSchema>;

const GetPersonalizedTutoringOutputSchema = z.object({
  explanation: z.string().describe('A clear and personalized explanation of the topic with reasoning.'),
});
export type GetPersonalizedTutoringOutput = z.infer<typeof GetPersonalizedTutoringOutputSchema>;

export async function getPersonalizedTutoring(input: GetPersonalizedTutoringInput): Promise<GetPersonalizedTutoringOutput> {
  return getPersonalizedTutoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPersonalizedTutoringPrompt',
  input: {schema: GetPersonalizedTutoringInputSchema},
  output: {schema: GetPersonalizedTutoringOutputSchema},
  prompt: `You are an AI tutor providing personalized assistance to students.

You will receive a topic, a question about the topic, and the student's academic level.
Your goal is to provide a clear and personalized explanation with reasoning that helps the student understand the material.

Topic: {{{topic}}}
Question: {{{question}}}
Student Level: {{{studentLevel}}}

Explanation:`,
});

const getPersonalizedTutoringFlow = ai.defineFlow(
  {
    name: 'getPersonalizedTutoringFlow',
    inputSchema: GetPersonalizedTutoringInputSchema,
    outputSchema: GetPersonalizedTutoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
