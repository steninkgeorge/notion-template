import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react';
import { AIGenerateComponentNode } from './ai-generate-component';

declare module '@tiptap/core' {
  interface Commands<ReturnType = any> {
    AIgenerativenode: {
      insertPromptBox: (attributes: Record<string, any>) => ReturnType;
    };
  }
}

export const AIassistantNode = Node.create({
  name: 'AIgenerativenode',
  group: 'block',
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      initialPrompt: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-assistant"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'ai-assistant' }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIGenerateComponentNode);
  },

  addCommands() {
    return {
      insertPromptBox:
        (attributes: Record<string, any> = {}) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: attributes,
            })
            .run();
        },
    };
  },
});
