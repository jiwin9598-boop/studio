'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Sparkles, CornerDownLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Card, CardContent } from '@/components/ui/card';
import { getTutorResponseAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const tutorFormSchema = z.object({
  topic: z.string().min(3, 'Topic is required.'),
  question: z.string().min(5, 'Question is required.'),
  studentLevel: z.enum(['high-school', 'college', 'post-graduate'], {
    required_error: 'Please select your academic level.',
  }),
});

type TutorFormValues = z.infer<typeof tutorFormSchema>;

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  topic?: string;
  level?: string;
}

export function TutorClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      topic: '',
      question: '',
      studentLevel: 'college',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        // scrollArea does not expose a imperative handle.
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  async function onSubmit(values: TutorFormValues) {
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: values.question,
      topic: values.topic,
      level: values.studentLevel,
    };

    setMessages((prev) => [...prev, userMessage]);
    form.reset({ ...values, question: '' });

    const result = await getTutorResponseAction(values);

    if (result.success && result.data) {
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.data.explanation,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-6 mb-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Your conversation will appear here.</p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.type === 'user' ? '' : ''}`}>
              <Avatar>
                <AvatarFallback>
                  {message.type === 'user' ? <User /> : <Sparkles />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-semibold">
                  {message.type === 'user' ? 'You' : 'AI Tutor'}
                </p>
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground markdown-content" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }}>
                </div>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback><Sparkles /></AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-auto">
        <Card className="p-0">
          <CardContent className="p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="sr-only">Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="Topic (e.g., Cellular Respiration)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="post-graduate">Post-Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Question</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="Ask your question..."
                            {...field}
                            rows={2}
                            className="pr-20 min-h-0"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if(form.formState.isValid) {
                                   form.handleSubmit(onSubmit)();
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-12" disabled={isLoading || !form.formState.isValid}>
                           {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
