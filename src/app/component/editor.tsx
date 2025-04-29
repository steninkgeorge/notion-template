'use client';

import { useEditorStore } from '../store/use-editor-store';

import { TemplateEditor } from './template-editor';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import { useRef } from 'react';
//TODO: pagination

const Editor = () => {
  const { setEditor } = useEditorStore();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editor = useTemplateEditor('', {
    onBeforeCreate({ editor }) {
      setEditor(editor);
    },
    onCreate({ editor }) {
      console.log('Editor created');
      setEditor(editor);
      // Make sure title node exists when editor is created
      const { doc, schema } = editor.state;
      if (!doc.firstChild || doc.firstChild.type !== schema.nodes.titleNode) {
        editor.commands.insertContentAt(0, {
          type: 'titleNode',
        });
      }
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(editor);
    },
  });

  return (
    <div
      ref={editorContainerRef}
      className="mt-5 mb-10 min-h-screen min-w-screen  flex item-center justify-center relative"
    >
      <TemplateEditor editor={editor} />
    </div>
  );
};

export default Editor;
