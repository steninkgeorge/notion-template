import { Editor } from '@tiptap/react';
import { LucideIcon } from 'lucide-react';

export interface CommandItem extends CommandProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  markdown?: string;
  [key: string]: any;
}

export interface CommandProps {
  title: string;
  command: ({ editor }: { editor: Editor }) => void;
}
