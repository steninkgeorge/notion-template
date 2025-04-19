import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { DraggableNode } from './draggable-node';

export default Node.create({
  name: 'draggableItem',

  group: 'block',

  content: 'block+',

  draggable: true,

  addAttributes() {
    return {
      'data-placeholder': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-placeholder'),
        renderHTML: (attributes) => {
          if (!attributes['data-placeholder']) {
            return {};
          }
          return {
            'data-placeholder': attributes['data-placeholder'],
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DraggableNode);
  },
});
