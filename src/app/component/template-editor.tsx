'use client';
import * as React from 'react';

import { Editor, EditorContent } from '@tiptap/react';
import { TextBubbleMenu } from './bubble/bubble-menu';
import { AiSuggestionPopoverWrapper } from '../../tiptap-extensions/ai-suggestion/suggestion/popover/popover-wrapper';
// import { TextBubbleMenu } from './bubble/bubble-menu';

interface TemplateEditorProps {
  editor: Editor | null;
}

export const TemplateEditor = ({ editor }: TemplateEditorProps) => {
  return (
    <div>
      <EditorContent editor={editor} />
      {editor && <AiSuggestionPopoverWrapper editor={editor} />}

      <TextBubbleMenu editor={editor} />
    </div>
  );
};
