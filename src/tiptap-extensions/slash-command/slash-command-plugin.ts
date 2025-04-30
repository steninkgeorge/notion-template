import { Editor, Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { CommandItem, CommandProps } from '@/types/command';
import { createRoot, Root } from 'react-dom/client';
import { CommandMenu } from '@/app/component/command-menu';
import React from 'react';
import { title } from 'process';
import { allItems } from '@/constants/command-list-items';

const CommandsPlugin = Extension.create({
  name: 'insertMenu',

  addProseMirrorPlugins() {
    return [
      Suggestion<CommandItem>({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();

          props.command({ editor, range, props });
        },
        items: ({ query }) => {
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

            return item.searchTerms.some((term: string) =>
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
