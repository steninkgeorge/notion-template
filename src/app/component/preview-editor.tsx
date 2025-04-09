import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export const MarkdownEditor = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: '',
    editable: false,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="bg-white text-sm rounded-md px-3 py-2 border border-neutral-300 min-h-[100px] max-h-[400px] w-full overflow-y-auto">
      <EditorContent editor={editor} />
    </div>
  );
};
