'use client';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import { Editor, EditorContent } from '@tiptap/react';
import { TextBubbleMenu } from '../../../../src/app/component/bubble/bubble-menu';

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
