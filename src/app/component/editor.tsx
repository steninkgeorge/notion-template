"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorStore } from "../store/use-editor-store";
import StarterKit from "@tiptap/starter-kit";
import DraggableBlockExtension from "@/extensions/draggable-block-extension";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { WrapBlocksInDraggable } from "@/extensions/wrap-plugin";
import CommandsPlugin from "@/extensions/slash-command/slash-command-plugin";
import { Markdown } from "tiptap-markdown";
//TODO: pagination

const Editor = () => {
   
  const {setEditor} = useEditorStore()
  const editor = useEditor({
    onBeforeCreate({ editor }) {
      setEditor(editor);
    },
    onCreate({ editor }) {
      // The editor is ready.
      setEditor(editor);
    },
    onUpdate({ editor }) {
      // The content has changed.
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      // The selection has changed.
      setEditor(editor);
    },
    onTransaction({ editor, transaction }) {
      // The editor state has changed.
      setEditor(editor);
    },
    onFocus({ editor, event }) {
      // The editor is focused.
      setEditor(editor);
    },
    onBlur({ editor, event }) {
      // The editor isn’t focused anymore.
      setEditor(editor);
    },
    onDestroy() {
      // The editor is being destroyed.
      setEditor(editor);
    },

    extensions: [
    
      StarterKit,
      CommandsPlugin,
      TaskList,
      Markdown,
      TaskItem.configure({
        nested: true,
      }),

      BulletList.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      DraggableBlockExtension,
      WrapBlocksInDraggable,
      
    ],

    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[816px] w-[816px] cursor-text p-10 bg-white shadow-lg rounded-lg",
      },
    },
    content: `<div data-type="draggable-item">
          <p>Followed by a fancy draggable item.</p>
        </div>
        <h1>h1 tag</h1>`,
  });

  //TODO: pagination
  //TODO: notion like editor
  //TODO: AI provider

  return (
    <div className="mt-5 min-h-screen min-w-screen  flex item-center justify-center">
      <EditorContent editor={editor} />

    </div>
  );
};

export default Editor;
