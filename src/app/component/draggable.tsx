import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Grab, Grip } from "lucide-react";
import React, { useRef } from "react";

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
