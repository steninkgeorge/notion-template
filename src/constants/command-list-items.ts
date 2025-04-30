import { CommandItem } from '@/types/command';
import { Editor } from '@tiptap/react';
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Sparkles,
  Image,
  ToggleRight,
  Copy,
  Trash2,
  Minus,
  Table,
  Columns,
  Type,
  Bold,
  Italic,
  Bookmark,
  Video,
  VideotapeIcon,
} from 'lucide-react';

export const allItems: CommandItem[] = [
  {
    title: 'AI Assistant',
    description: 'Generate content with AI',
    icon: Sparkles,
    searchTerms: ['magic', 'generate'],
    category: 'Ask AI',
    markdown: '', // No markdown equivalent
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().insertPromptBox({ initialPrompt: '' }).run(),
  },
  // Basic Blocks
  {
    title: 'Text',
    description: 'Plain text paragraph',
    icon: Text,
    searchTerms: ['p', 'text'],
    category: 'Basic',
    markdown: '', // Plain text needs no markdown
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: Heading1,
    searchTerms: ['h1', 'title'],
    category: 'Basic',
    markdown: '# ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2,
    searchTerms: ['h2', 'subtitle'],
    category: 'Basic',
    markdown: '## ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: Heading3,
    searchTerms: ['h3'],
    category: 'Basic',
    markdown: '### ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setNode('heading', { level: 3 }).run(),
  },

  // Lists
  {
    title: 'Bullet List',
    description: 'Create an unordered list',
    icon: List,
    searchTerms: ['ul', 'bullet'],
    category: 'Lists',
    markdown: '- ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create an ordered list',
    icon: ListOrdered,
    searchTerms: ['ol', 'numbered'],
    category: 'Lists',
    markdown: '1. ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().toggleOrderedList().run(),
  },

  // Media
  {
    title: 'Image',
    description: 'Upload or embed an image',
    icon: Image,
    searchTerms: ['photo', 'picture'],
    category: 'Media',
    command: () => {},
  },
  {
    title: 'Gif',
    description: 'Upload or embed an gif',
    icon: VideotapeIcon,
    searchTerms: ['gif', 'media'],
    category: 'Media',
    command: () => {},
  },
  {
    title: 'Video',
    description: 'Upload or embed a video',
    icon: Video,
    searchTerms: ['video', 'media'],
    category: 'Media',
    command: () => {},
  },

  {
    title: 'Table',
    description: 'Insert a table',
    icon: Table,
    searchTerms: ['grid', 'spreadsheet'],
    category: 'Media',
    command: () => {},
  },
  {
    title: 'Web bookmark',
    description: 'Add a web bookmark',
    icon: Bookmark,
    searchTerms: ['Web', 'Bookmark'],
    category: 'Media',
    command: () => {},
  },

  // Advanced
  {
    title: 'AI Block',
    description: 'Generate content with AI',
    icon: Sparkles,
    searchTerms: ['magic', 'generate'],
    category: 'Advanced',
    markdown: '', // No markdown equivalent
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().insertPromptBox({ initialPrompt: '' }).run(),
  },
  {
    title: 'Code Block',
    description: 'Insert a code block',
    icon: Code,
    searchTerms: ['snippet'],
    category: 'Advanced',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setCodeBlock().run(),
  },
  {
    title: 'Quote',
    description: 'Insert a blockquote',
    icon: Quote,
    searchTerms: ['citation'],
    category: 'Advanced',
    markdown: '> ',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setBlockquote().run(),
  },
  {
    title: 'Horizontal Rule',
    description: 'Insert a divider line',
    icon: Minus,
    searchTerms: ['divider', 'hr'],
    category: 'Advanced',
    markdown: '---',
    command: ({ editor }: { editor: Editor }) =>
      editor.chain().focus().setHorizontalRule().run(),
  },
];
