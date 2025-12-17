'use server';

/**
 * @fileOverview A flow for generating adaptive quizzes based on a student's understanding of a topic.
 *
 * - generateAdaptiveQuiz - A function that generates a quiz tailored to the student's learning level and progress.
 * - GenerateAdaptiveQuizInput - The input type for the generateAdaptiveQuiz function.
 * - GenerateAdaptiveQuizOutput - The return type for the generateAdaptiveQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdaptiveQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the quiz.'),
  studentUnderstanding: z
    .string()
    .describe(
      'A description of the student’s current understanding of the topic.'
    ),
  quizLength: z
    .number()
    .min(1)
    .max(20)
    .default(5)
    .describe('The number of questions to include in the quiz.'),
});
export type GenerateAdaptiveQuizInput = z.infer<typeof GenerateAdaptiveQuizInputSchema>;

const GenerateAdaptiveQuizOutputSchema = z.object({
  quizQuestions: z.array(
    z.object({
      question: z.string().describe('The text of the quiz question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      explanation: z
        .string()
        .describe('An explanation of why the answer is correct.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateAdaptiveQuizOutput = z.infer<typeof GenerateAdaptiveQuizOutputSchema>;

export async function generateAdaptiveQuiz(
  input: GenerateAdaptiveQuizInput
): Promise<GenerateAdaptiveQuizOutput> {
  return generateAdaptiveQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdaptiveQuizPrompt',
  input: {schema: GenerateAdaptiveQuizInputSchema},
  output: {schema: GenerateAdaptiveQuizOutputSchema},
  prompt: `You are an expert quiz generator, skilled at creating quizzes tailored to a student's level of understanding.

  Based on the student's current understanding of the topic, create a quiz with {{{quizLength}}} questions.

  Topic: {{{topic}}}
  Student Understanding: {{{studentUnderstanding}}}

  Each question should have multiple choice options, and the correct answer should be clearly indicated.
  Also include an explanation of why the answer is correct.

  The quiz should assess the student's knowledge of the topic and identify areas where they need to focus more study effort.
  Make the difficulty appropriate for the student's level; do not make it too easy or too hard, but instead focusing on challenging them appropriately.

  Ensure that the quiz questions are clear, concise, and relevant to the topic.
  Do not generate questions outside of the specified topic.
  Make the multiple choice options distinct and non-overlapping.
`,
});

const generateAdaptiveQuizFlow = ai.defineFlow(
  {
    name: 'generateAdaptiveQuizFlow',
    inputSchema: GenerateAdaptiveQuizInputSchema,
    outputSchema: GenerateAdaptiveQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
