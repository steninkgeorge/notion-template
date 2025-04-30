import { Editor, EditorOptions, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CommandsPlugin from '@/tiptap-extensions/slash-command/slash-command-plugin';
import { Markdown } from 'tiptap-markdown';
import { AIassistantNode } from '@/tiptap-extensions/ai-generate/ai-generate-node';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '@/tiptap-extensions/fontsize/font-size';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import GlobalDragHandle from '@/tiptap-extensions/drag-handle/drag-handle';
import Dropcursor from '@tiptap/extension-dropcursor';
import { AiSuggestion } from '@/tiptap-extensions/ai-suggestion/ai-suggestion';
import { rules } from '@/tiptap-extensions/ai-suggestion/rules';
import { TocHeading } from '@/tiptap-extensions/heading/heading';
import { HighlightExtension } from '@/tiptap-extensions/highlight/highlight';
import { TitleNode } from '@/tiptap-extensions/filename/filename';
import { DynamicPlaceholder } from '@/tiptap-extensions/placeholder/placeholder';

export const useTemplateEditor: (
  content: string,
  options?: Partial<EditorOptions>
) => Editor | null = (content = '', options: Partial<EditorOptions> = {}) => {
  const fallbackEditorProps: EditorOptions['editorProps'] = {
    attributes: {
      class:
        'focus:outline-none min-h-[816px] w-[816px] cursor-text p-10 bg-white',
    },
  };

  return useEditor({
    ...options,
    extensions: [
      StarterKit.configure({ heading: false }),
      HighlightExtension.configure({ multicolor: true }),
      TocHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      AiSuggestion.configure({
        rules: rules,
        loadOnStart: false,
        reloadOnUpdate: true,
        debounceTimeout: 5000,
      }),
      // Title node with permanent placeholder
      TitleNode.configure({
        HTMLAttributes: {
          class: 'title-node',
        },
      }),
      // Dynamic placeholders for other content that only show on hover/focus
      DynamicPlaceholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            const level = node.attrs.level || 1;
            const placeholders = [
              'Heading 1 ',
              'Heading 2',
              'Heading 3 ',
              'Heading 4',
              'Heading 5',
              'Heading 6',
            ];
            return placeholders[level - 1] || `Heading ${level}`;
          }

          return 'Write ,type / for commands';
        },
        emptyNodeClass: 'is-empty-content',
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
      GlobalDragHandle.configure({
        customNodes: ['ai-assistant'],
        excludedTags: ['div[data-type="title-node"]'],
      }),
      ...(options.extensions || []),
    ],
    content: {
      type: 'doc',
      content: [
        {
          type: 'title',
        },
        {
          type: content,
        },
      ],
    },
    editorProps: options.editorProps ?? fallbackEditorProps,
  });
};
