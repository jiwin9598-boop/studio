import { ResourceCard } from '@/components/library/resource-card';
import type { Resource } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const resources: Resource[] = [
  {
    id: '1',
    title: 'Comprehensive Calculus Notes',
    description: 'Detailed notes covering limits, derivatives, and integration. Perfect for review.',
    type: 'Notes',
    subject: 'Math',
    imageUrl: PlaceHolderImages.find(img => img.id === 'calculus-notes')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'calculus-notes')?.imageHint || 'notebook study',
  },
  {
    id: '2',
    title: 'In-depth Article on Ancient Rome',
    description: 'Explore the rise and fall of the Roman Empire, its culture, and key figures.',
    type: 'Article',
    subject: 'History',
    imageUrl: PlaceHolderImages.find(img => img.id === 'history-article')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'history-article')?.imageHint || 'library books',
  },
  {
    id: '3',
    title: 'Video Tutorial: Quantum Mechanics',
    description: 'An engaging video that simplifies the core concepts of quantum mechanics.',
    type: 'Video',
    subject: 'Science',
    imageUrl: PlaceHolderImages.find(img => img.id === 'physics-video')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'physics-video')?.imageHint || 'laptop screen',
  },
  {
    id: '4',
    title: 'Guide to Organic Chemistry Reactions',
    description: 'A handy guide with diagrams and explanations for major organic reactions.',
    type: 'Notes',
    subject: 'Science',
    imageUrl: PlaceHolderImages.find(img => img.id === 'chemistry-guide')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'chemistry-guide')?.imageHint || 'science lab',
  },
  {
    id: '5',
    title: "Summary of Shakespeare's Macbeth",
    description: 'Character analyses, plot summary, and theme exploration for the classic play.',
    type: 'Article',
    subject: 'Literature',
    imageUrl: PlaceHolderImages.find(img => img.id === 'literature-summary')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'literature-summary')?.imageHint || 'book open',
  },
  {
    id: '6',
    title: 'JavaScript Promises: A Complete Guide',
    description: 'Master asynchronous JavaScript with this comprehensive tutorial on Promises.',
    type: 'Video',
    subject: 'Computer Science',
    imageUrl: PlaceHolderImages.find(img => img.id === 'coding-tutorial')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(img => img.id === 'coding-tutorial')?.imageHint || 'code computer',
  },
];

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Resource Library
        </h1>
        <p className="text-muted-foreground">
          Find notes, articles, and videos to supercharge your studies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
