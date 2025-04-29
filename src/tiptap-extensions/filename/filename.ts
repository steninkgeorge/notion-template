// src/tiptap-extensions/title-node/title-node.ts
import { Node, mergeAttributes, isNodeEmpty } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface TitleNodeOptions {
  HTMLAttributes: Record<string, any>;
  placeholder: string;
}

export const TitleNode = Node.create<TitleNodeOptions>({
  name: 'titleNode',

  priority: 1000, // High priority to ensure it loads first

  group: 'block',
  content: 'inline*',

  // Make title node not selectable for drag operations
  selectable: false,

  // Prevent title node from being dragged
  draggable: false,

  parseHTML() {
    return [{ tag: 'div[data-type="title-node"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'title-node',
        'data-placeholder': this.options.placeholder,
        draggable: 'false',
      }),
      0,
    ];
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'title-node',
      },
      placeholder: 'New Page',
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('titleNodePlugin'),

        // Add decoration for placeholder on title node
        props: {
          decorations: ({ doc }) => {
            const decorations: Decoration[] = [];

            // Look only at the first node (title node)
            const firstNode = doc.firstChild;
            if (
              firstNode &&
              firstNode.type.name === 'titleNode' &&
              isNodeEmpty(firstNode)
            ) {
              const decoration = Decoration.node(0, firstNode.nodeSize, {
                class: 'is-empty',
                'data-placeholder': this.options.placeholder,
              });
              decorations.push(decoration);
            }

            return DecorationSet.create(doc, decorations);
          },

          // Prevent dropping content before the title node
          handleDrop(view, event) {
            const dropPos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;

            if (dropPos !== undefined) {
              const $pos = view.state.doc.resolve(dropPos);

              // If trying to drop at or before the title node position
              if ($pos.depth === 0 && $pos.index() === 0) {
                // Prevent the drop at this position
                return true;
              }
            }

            // Let the default handler deal with other positions
            return false;
          },
        },

        appendTransaction(transactions, oldState, newState) {
          // Skip if there are no transactions
          if (!transactions.length) return null;

          const { doc, schema } = newState;
          const firstNode = doc.firstChild;

          // If the first node is already a title node, ensure nothing is before it
          if (firstNode && firstNode.type === schema.nodes.titleNode) {
            // Everything is in order, no need for changes
            return null;
          }

          // Create a transaction to ensure the title node is at the beginning
          const tr = newState.tr;

          // If title node exists elsewhere in the document, find and remove it first
          let titleNodeFound = false;
          doc.descendants((node, pos) => {
            if (node.type === schema.nodes.titleNode && !titleNodeFound) {
              tr.delete(pos, pos + node.nodeSize);
              titleNodeFound = true;
              return false;
            }
            return true;
          });

          // Create and insert a new title node at the beginning
          const titleNode = schema.nodes.titleNode.create();
          tr.insert(0, titleNode);

          return tr;
        },
      }),
    ];
  },
});
