import TiptapHeading from '@tiptap/extension-heading';
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import { Draggable } from '@/app/component/draggable';

export const Heading = TiptapHeading.extend({
  draggable: true,

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 1;
    const tagName = `h${level}`;

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'draggable-item',
        class: 'heading-wrapper',
      }),
      [tagName, {}, 0],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(Draggable);
  },
});

export default Heading;
