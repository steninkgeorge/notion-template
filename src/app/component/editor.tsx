'use client';

import { useEditorStore } from '../store/use-editor-store';

import { TemplateEditor } from './template-editor';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
//TODO: pagination

const Editor = () => {
  const { setEditor } = useEditorStore();
  const editor = useTemplateEditor('', {
    onBeforeCreate({ editor }) {
      setEditor(editor);
    },
    onCreate({ editor }) {
      // The editor is ready.
      setEditor(editor);
      console.log('Editor updated');
      console.log(
        'Drag handles:',
        document.querySelectorAll('.custom-drag-handle').length
      );
    },
    onUpdate({ editor }) {
      // The content has changed.

      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      // The selection has changed.
      setEditor(editor);
    },
    onTransaction({ editor }) {
      // The editor state has changed.
      setEditor(editor);
    },
    onFocus({ editor }) {
      // The editor is focused.
      setEditor(editor);
    },
    onBlur({ editor }) {
      // The editor isn’t focused anymore.
      setEditor(editor);
    },
    onDestroy() {
      // The editor is being destroyed.
      setEditor(editor);
    },
  });

  return (
    <div className="mt-5 mb-10 min-h-screen min-w-screen  flex item-center justify-center">
      <TemplateEditor editor={editor} />
    </div>
  );
};

export default Editor;
