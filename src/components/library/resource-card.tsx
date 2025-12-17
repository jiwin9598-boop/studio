import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={resource.imageUrl}
          alt={resource.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={resource.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={cn(
              'border-primary/50 text-primary',
              'dark:border-primary/70 dark:text-primary'
            )}
          >
            {resource.subject}
          </Badge>
          <Badge variant="secondary">{resource.type}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
