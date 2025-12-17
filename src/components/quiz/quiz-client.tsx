'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, XCircle, Sparkles, Repeat } from 'lucide-react';
import Confetti from 'react-dom-confetti';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { createQuizAction } from '@/lib/actions';
import type { GenerateAdaptiveQuizOutput } from '@/ai/flows/generate-adaptive-quiz';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const quizFormSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  studentUnderstanding: z
    .string()
    .min(10, 'Please describe your understanding in at least 10 characters.'),
  quizLength: z.coerce.number().min(3).max(10),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;
type QuizQuestion = GenerateAdaptiveQuizOutput['quizQuestions'][0];

export function QuizClient() {
  const [quizState, setQuizState] = useState<'idle' | 'generating' | 'active' | 'finished'>('idle');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { topic: '', studentUnderstanding: '', quizLength: 5 },
  });

  async function onSubmit(values: QuizFormValues) {
    setQuizState('generating');
    setQuiz(null);
    const result = await createQuizAction(values);
    if (result.success && result.data) {
      setQuiz(result.data.quizQuestions);
      setQuizState('active');
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(result.data.quizQuestions.length).fill(''));
      setScore(0);
      setShowConfetti(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
      setQuizState('idle');
    }
  }

  function handleAnswer(answer: string) {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < quiz!.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      let finalScore = 0;
      quiz!.forEach((q, index) => {
        if (q.correctAnswer === userAnswers[index]) {
          finalScore++;
        }
      });
      setScore(finalScore);
      setQuizState('finished');
      if (finalScore / quiz!.length >= 0.8) {
        setShowConfetti(true);
      }
    }
  }
  
  function restartQuiz() {
    setQuizState('idle');
    setQuiz(null);
    form.reset();
  }

  const currentQuestion = quiz?.[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.length) * 100 : 0;
  
  if (quizState === 'active' && currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {quiz!.length}
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold">{currentQuestion.question}</p>
          <RadioGroup
            value={userAnswers[currentQuestionIndex]}
            onValueChange={handleAnswer}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${i}`} />
                <Label htmlFor={`option-${i}`} className="font-normal">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {userAnswers[currentQuestionIndex] && quizState !== 'finished' && (
             <Alert variant={userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'default' : 'destructive'} 
              className={userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? "bg-green-100 dark:bg-green-900/30 border-green-500" : ""}>
               {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
               <AlertTitle>{userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}</AlertTitle>
               <AlertDescription>{currentQuestion.explanation}</AlertDescription>
             </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextQuestion} disabled={!userAnswers[currentQuestionIndex]} className="ml-auto">
            {currentQuestionIndex < quiz!.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (quizState === 'finished') {
    const percentage = (score / quiz!.length) * 100;
    return (
      <Card className="text-center">
         <Confetti active={showConfetti} config={{angle: 90, spread: 360, startVelocity: 40, elementCount: 70, dragFriction: 0.12, duration: 3000, stagger: 3, width: "10px", height: "10px"}} />
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-bold">{percentage.toFixed(0)}%</p>
          <p className="text-muted-foreground">You answered {score} out of {quiz!.length} questions correctly.</p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          {percentage >= 80 ? (
            <p className="text-green-600 dark:text-green-400 flex items-center gap-2"><Sparkles className="h-5 w-5" />Excellent work!</p>
          ): percentage >= 60 ? (
            <p className="text-yellow-600 dark:text-yellow-400">Good effort! A little more practice will help.</p>
          ): (
            <p className="text-red-600 dark:text-red-400">Keep trying! Review the material and try again.</p>
          )}
          <Button onClick={restartQuiz}>
            <Repeat className="mr-2 h-4 w-4" />
            Take Another Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {quizState === 'generating' ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your personalized quiz...</p>
            <div className="w-full max-w-md space-y-4 mt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Photosynthesis" {...field} />
                    </FormControl>
                    <FormDescription>What subject do you want a quiz on?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentUnderstanding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Understanding</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I know the basic formula but struggle with the light-independent reactions." {...field} />
                    </FormControl>
                    <FormDescription>Describe your current knowledge level on this topic.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quizLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of questions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 5, 10].map(num => <SelectItem key={num} value={String(num)}>{num} Questions</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={quizState === 'generating'}>
                {quizState === 'generating' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : 'Start Quiz'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
