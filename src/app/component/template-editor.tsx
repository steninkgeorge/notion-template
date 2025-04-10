'use client';
import * as React from 'react';

import { Editor, EditorContent } from '@tiptap/react';
import { TextBubbleMenu } from './bubble/bubble-menu';
// import { TextBubbleMenu } from './bubble/bubble-menu';

interface TemplateEditorProps {
  editor: Editor | null;
}

export const TemplateEditor = ({ editor }: TemplateEditorProps) => {
  return (
    <div>
      <EditorContent editor={editor} />
      <TextBubbleMenu editor={editor} />
    </div>
  );
};
