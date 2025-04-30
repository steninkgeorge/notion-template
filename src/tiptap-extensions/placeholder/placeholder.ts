// src/tiptap-extensions/dynamic-placeholder/dynamic-placeholder.ts
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node } from '@tiptap/pm/model';

export interface DynamicPlaceholderOptions {
  // Placeholder that only shows on hover/focus for non-title nodes
  placeholder: string | ((props: { node: Node }) => string);

  // Class applied to empty nodes
  emptyNodeClass: string;
}

/**
 * This extension adds dynamic placeholders that only appear on hover/focus
 * for regular content nodes (not the title node)
 */
export const DynamicPlaceholder = Extension.create<DynamicPlaceholderOptions>({
  name: 'dynamicPlaceholder',

  addOptions() {
    return {
      placeholder: 'Type something...',
      emptyNodeClass: 'is-empty-content',
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dynamicPlaceholder'),
        props: {
          decorations: ({ doc, selection }) => {
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            // Skip first node (which is title node)
            let skipFirst = true;

            doc.descendants((node, pos) => {
              if (skipFirst) {
                skipFirst = false;
                return true;
              }

              // Skip title nodes - they have their own placeholder
              if (node.type.name === 'titleNode') {
                return true;
              }

              // Check if node is empty and can have content
              const isEmpty = node.isTextblock && node.content.size === 0;

              if (isEmpty) {
                // Only add placeholder for nodes that are being edited or hovered
                const hasAnchor =
                  anchor >= pos && anchor <= pos + node.nodeSize;

                if (hasAnchor) {
                  // Resolve the placeholder value (string or function)
                  const placeholderValue =
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({ node })
                      : this.options.placeholder;

                  const decoration = Decoration.node(pos, pos + node.nodeSize, {
                    class: this.options.emptyNodeClass,
                    'data-placeholder': placeholderValue,
                  });

                  decorations.push(decoration);
                }
              }

              return true;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
