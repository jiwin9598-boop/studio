
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Notes' | 'Article' | 'Video';
  subject: 'Math' | 'History' | 'Science' | 'Literature' | 'Computer Science';
  imageUrl: string;
  imageHint: string;
}
