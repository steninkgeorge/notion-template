import TipTapParagraph from '@tiptap/extension-paragraph';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DraggableNode } from '../draggable-node';

export const Paragraph = TipTapParagraph.extend({
  draggable: true,

  addNodeView() {
    return ReactNodeViewRenderer(DraggableNode);
  },
});

export default Paragraph;
