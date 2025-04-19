import { Editor, Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { CommandProps } from '@/types/command';
import { createRoot, Root } from 'react-dom/client';
import { CommandMenu } from '@/app/component/command-menu';
import React from 'react';
import { title } from 'process';

const CommandsPlugin = Extension.create({
  name: 'insertMenu',

  addProseMirrorPlugins() {
    return [
      Suggestion<CommandProps>({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();

          props.command({ editor, range, props });
        },
        items: ({ query }) => {
          return [
            //ai options
            {
              title: 'AI tools',
              command: ({ editor }: { editor: Editor }) =>
                editor
                  .chain()
                  .focus()
                  .insertPromptBox({ initialPrompt: '' })
                  .run(),
            },

            //text formatting
            {
              title: 'Heading',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode('heading', { level: 1 }).run(),
            },
            {
              title: 'Subheading',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode('heading', { level: 2 }).run(),
            },
            {
              title: 'Quote',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setBlockquote().run(),
            },
            {
              title: 'Bullet List',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: 'Numbered List',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleOrderedList().run(),
            },
            {
              title: 'Code Block',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setCodeBlock().run(),
            },
            //insert options
            //table
            //image -> custom node
            //column -> custom node (maybe)
            //horizontal rule
          ]
            .filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);
        },
        startOfLine: true,
        allow: ({ state }) => {
          const node = state.selection.$from.node();
          if (!node) return false;
          return node.textBetween(0, 1) === '/';
        },
        render: () => {
          let rootElement: HTMLElement | null = null;
          let root: Root | null = null;

          return {
            onStart: (props) => {
              rootElement = document.createElement('div');
              const editorContainer =
                document.querySelector('.editor-container');
              if (!editorContainer) return;

              editorContainer.appendChild(rootElement);
              root = createRoot(rootElement);
              const containerRect = editorContainer.getBoundingClientRect();
              const scrollTop = editorContainer.scrollTop;

              root.render(
                React.createElement(CommandMenu, {
                  ...props,
                  title: title,
                  items: props.items,
                  command: props.command,
                  clientRect: () => {
                    const rect = props.clientRect?.();
                    if (!rect) return null;

                    // Adjust for container position and scroll
                    return new DOMRect(
                      rect.left - containerRect.left,
                      rect.top - containerRect.top + scrollTop,
                      rect.width,
                      rect.height
                    );
                  },
                })
              );
            },
            onUpdate: (props) => {
              if (root && rootElement) {
                const editorContainer =
                  document.querySelector('.editor-container');
                if (!editorContainer) return;

                const containerRect = editorContainer.getBoundingClientRect();
                const scrollTop = editorContainer.scrollTop;
                React.createElement(CommandMenu, {
                  ...props,
                  title: title,
                  items: props.items,
                  command: props.command,
                  clientRect: () => {
                    const rect = props.clientRect?.();
                    if (!rect) return null;

                    return new DOMRect(
                      rect.left - containerRect.left,
                      rect.top - containerRect.top + scrollTop,
                      rect.width,
                      rect.height
                    );
                  },
                });
              }
            },

            onExit: () => {
              // Clean up
              if (root) {
                root.unmount();
              }
              if (rootElement && rootElement.parentNode) {
                rootElement.parentNode.removeChild(rootElement);
              }
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
