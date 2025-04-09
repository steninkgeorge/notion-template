import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

export const Draggable = () => {
  return (
    <NodeViewWrapper className="draggable-item">
      <div
        className="drag-handle"
        contentEditable={false}
        draggable="true"
        data-drag-handle
      />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};
