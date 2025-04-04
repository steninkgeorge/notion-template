import React, { JSX, useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Grip } from "lucide-react";



export const DraggableNode = ({node}:{node:any})=>{

  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store the timeout ID

  const handleMouseEnter = () => {
    setVisible(true);
        resetTimer();

  };

  const handleMouseMove = () => {
    setVisible(true);
        resetTimer();
  };

   const resetTimer = () => {
     if (timeoutRef.current) {
       clearTimeout(timeoutRef.current); // Clear previous timeout
     }
     timeoutRef.current = setTimeout(() => setVisible(false), 500); // Hide after 1s
   };
   


  return (
    <NodeViewWrapper
      className="relative group my-2 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      {/* Drag Handle */}
      <div
        className="absolute left-0 top-0 translate-y-1 w-4 h-4 bg-transparent cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        contentEditable={false}
        data-drag-handle
        draggable="true"
      >
        <Grip className="w-4 h-4 text-gray-400" />
      </div>
      <div className="pl-6 flex-1">
        <NodeViewContent />
      </div>
      {/* Heading Content */}
    </NodeViewWrapper>
  );
}


