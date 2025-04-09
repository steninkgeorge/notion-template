import { Node } from '@tiptap/core';

const CustomParagraph = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'draggableItem' }, ['p', HTMLAttributes, 0]];
  },
});

export default CustomParagraph;
