import { Highlight } from '@tiptap/extension-highlight';

export const HighlightExtension = Highlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'highlight-fade-effect', // Tailwind classes for fading in/out
      },
    };
  },
});
