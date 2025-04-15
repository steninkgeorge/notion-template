import { Editor, EditorOptions, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CommandsPlugin from '@/extensions/slash-command/slash-command-plugin';
import { Markdown } from 'tiptap-markdown';
import { AIassistantNode } from '@/extensions/ai-generate/ai-generate-node';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '@/extensions/fontsize/font-size';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import GlobalDragHandle from '@/extensions/drag-handle/drag-handle';
import Dropcursor from '@tiptap/extension-dropcursor';
import { AiSuggestion } from '@/extensions/ai-suggestion/ai-suggestion';
import { rules } from '@/extensions/ai-suggestion/rules';

export const useTemplateEditor: (
  content: string,
  options?: Partial<EditorOptions>
) => Editor | null = (content = '', options: Partial<EditorOptions> = {}) => {
  const fallbackEditorProps: EditorOptions['editorProps'] = {
    attributes: {
      class:
        'focus:outline-none min-h-[816px] w-[816px] cursor-text p-10 bg-white shadow-lg rounded-lg',
    },
  };

  return useEditor({
    ...options,
    extensions: [
      StarterKit,
      AiSuggestion.configure({
        rules: rules,
        loadOnStart: false,
        debounceTimeout: 10000,
        reloadOnUpdate: true,
      }),
      Placeholder.configure({
        placeholder: 'type / for commands ',
      }),
      Dropcursor.configure({
        width: 2,
      }),
      Underline,
      CommandsPlugin,
      TextStyle,
      FontFamily,
      FontSize,
      TaskList,
      Markdown,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Color,
      AIassistantNode,
      TaskItem.configure({
        nested: true,
      }),
      GlobalDragHandle.configure({ customNodes: ['ai-assistant'] }),
      ...(options.extensions || []),
    ],
    content: content ?? '',
    editorProps: options.editorProps ?? fallbackEditorProps,
  });
};
