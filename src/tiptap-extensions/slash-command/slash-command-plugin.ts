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
          const allItems = [
            //ai options
            {
              title: 'Text',
              description: 'Just start writing with plain text',
              searchTerms: ['p', 'paragraph', 'text'],
              category: 'Basic blocks',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setParagraph().run(),
            },
            {
              title: 'Heading 1',
              description: 'Large section heading',
              searchTerms: ['h1', 'heading', 'header', 'title', 'large'],
              category: 'Basic blocks',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode('heading', { level: 1 }).run(),
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              searchTerms: [
                'h2',
                'heading',
                'subheading',
                'subtitle',
                'medium',
              ],
              category: 'Basic blocks',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode('heading', { level: 2 }).run(),
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              searchTerms: ['h3', 'heading', 'subheading', 'subtitle', 'small'],
              category: 'Basic blocks',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setNode('heading', { level: 3 }).run(),
            },
            // Lists
            {
              title: 'Bullet List',
              description: 'Create a simple bullet list',
              searchTerms: ['bullet', 'list', 'ul', 'unordered'],
              category: 'Lists',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              searchTerms: ['numbered', 'list', 'ol', 'ordered'],
              category: 'Lists',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().toggleOrderedList().run(),
            },
            // Media and embeds
            {
              title: 'Image',
              description: 'Upload or embed an image',
              searchTerms: ['image', 'photo', 'picture', 'media'],
              category: 'Media',
              command: ({ editor }: { editor: Editor }) => {
                // Implement image upload logic
                // For example: editor.chain().focus().setImage({ src: '...' }).run()
                console.log('Image command executed');
              },
            },
            // {
            //   title: 'Table',
            //   description: 'Add a table',
            //   searchTerms: ['table', 'grid', 'spreadsheet', 'matrix'],
            //   category: 'Media',
            //   command: ({ editor }: { editor: Editor }) => {
            //     // Insert table logic
            //     editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
            //   },
            // },
            // Code and quotes
            {
              title: 'Code Block',
              description: 'Add code with syntax highlighting',
              searchTerms: ['code', 'codeblock', 'programming'],
              category: 'Advanced',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setCodeBlock().run(),
            },
            {
              title: 'Quote',
              description: 'Insert a quote or citation',
              searchTerms: ['quote', 'blockquote', 'citation'],
              category: 'Advanced',
              command: ({ editor }: { editor: Editor }) =>
                editor.chain().focus().setBlockquote().run(),
            },
            // AI features
            {
              title: 'AI Assistant',
              description: 'Get help writing with AI',
              searchTerms: ['ai', 'assistant', 'help', 'generate', 'write'],
              category: 'AI',
              command: ({ editor }: { editor: Editor }) =>
                editor
                  .chain()
                  .focus()
                  .insertPromptBox({ initialPrompt: '' })
                  .run(),
            },
            //insert options
            //table
            //image -> custom node
            //column -> custom node (maybe)
            //horizontal rule
          ];
          if (!query) {
            // When no search query, show all items grouped by category
            return allItems;
          }

          return allItems.filter((item) => {
            if (item.title.toLowerCase().includes(query.toLowerCase())) {
              return true;
            }

            if (item.category.toLowerCase().includes(query.toLowerCase())) {
              return true;
            }

            return item.searchTerms.some((term) =>
              term.toLowerCase().includes(query.toLowerCase())
            );
          });
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
                root.render(
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
                  })
                );
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
