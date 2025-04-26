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
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },

    onDestroy() {
      // The editor is being destroyed.
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
