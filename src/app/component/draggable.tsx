import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Grab, Grip } from "lucide-react";
import React, { useRef } from "react";

export const Draggable = () => {
  
  return (
    // <NodeViewWrapper className="flex relative items-center max-w-full break-words whitespace-normal my-2 w-full group">
    //   <div
    //     className="absolute top-0 left-0 w-4 h-4 bg-transparent mt-[5px] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    //     contentEditable={false}
    //     draggable="true"
    //     data-drag-handle
    //   >
    //     <Grip className="size-4 text-gray-400" />
    //   </div>
    //   <NodeViewContent className="leading-normal pl-6 w-full" />
    // </NodeViewWrapper>

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
