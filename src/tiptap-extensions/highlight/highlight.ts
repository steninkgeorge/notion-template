import { Highlight } from '@tiptap/extension-highlight';

export const HighlightExtension = Highlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'bg-blue-200 ', // Tailwind classes for fading in/out
      },
    };
  },
});
