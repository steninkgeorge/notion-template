import React, { JSX, useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Grip } from "lucide-react";



export const DraggableNode = ({node}:{node:any})=>{

//     const isInsideListItem = node.parent?.type?.name === "listItem";
// if (isInsideListItem) {
//   console.log("isInsideListItem", isInsideListItem);
//   return (
//     <NodeViewWrapper>
//       <NodeViewContent />
//     </NodeViewWrapper>
//   );
// }
//   let Tag: keyof JSX.IntrinsicElements = "div"; // Default wrapper

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

//   switch (node.type.name) {
//     case "heading":
//       const level = node.attrs.level || 1;
//       if ([1, 2, 3, 4, 5, 6].includes(level)) {
//         Tag = `h${level}` as keyof JSX.IntrinsicElements;
//       }

//       break;

//     case "paragraph":
//       Tag = "p";
//       break;

//     default:
//       break;
//   }
  return (
    <NodeViewWrapper
      className="relative group my-2 w-full"
      draggable="true"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      {/* Drag Handle */}
      <div
        className="absolute left-0 top-0 translate-y-0.5 w-4 h-4 bg-transparent cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        contentEditable={false}
        data-drag-handle
      >
        <Grip className="w-4 h-4 text-gray-400" />
      </div>
      <div className="pl-6 flex-1">
        {/* {Tag === "p" ? (
          <NodeViewContent />
        ) : (
          <Tag>
            <NodeViewContent />
          </Tag>
        )} */}
        <NodeViewContent/>
      </div>
      {/* Heading Content */}
    </NodeViewWrapper>
  );
}


