import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Grip } from "lucide-react";



export const DraggableNode = ({node}:{node:any})=>{
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store the timeout ID
  const [isDragging, setIsDragging] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  const SCROLL_THRESHOLD = 200; // px from edge of window
  const SCROLL_SPEED = 15; // px per interval

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
  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);


   const startScrolling = useCallback(
   (direction: "up" | "down") => {
     stopScrolling();
     console.log(`Starting to scroll ${direction}`);

     scrollIntervalRef.current = setInterval(() => {
       const scrollAmount = direction === "up" ? -SCROLL_SPEED : SCROLL_SPEED;
       window.scrollBy(0, scrollAmount);
     }, 16);
   },
   [stopScrolling]
 );

   const handleDrag = useCallback(
     (event: DragEvent) => {
       console.log("Drag event", event.clientY);

       const { clientY } = event;
       const windowHeight = window.innerHeight;

       console.log(
         `Mouse position: ${clientY}, Window height: ${windowHeight}, Threshold: ${SCROLL_THRESHOLD}`
       );

       if (clientY < SCROLL_THRESHOLD) {
         console.log("Should scroll up");
         startScrolling("up");
       } else if (clientY > windowHeight - SCROLL_THRESHOLD) {
         console.log("Should scroll down");
         startScrolling("down");
       } else {
         stopScrolling();
       }
     },
     [startScrolling, stopScrolling]
   );

useEffect(() => {
  const dragHandle = dragHandleRef.current;
  if (!dragHandle) return;

  const handleDragStart = () => {
    setIsDragging(true);
    document.addEventListener("drag", handleDrag);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener("drag", handleDrag);
    stopScrolling();
  };

  dragHandle.addEventListener("dragstart", handleDragStart);
  document.addEventListener("dragend", handleDragEnd);
  document.addEventListener("drop", handleDragEnd);

  return () => {
    dragHandle.removeEventListener("dragstart", handleDragStart);
    document.removeEventListener("dragend", handleDragEnd);
    document.removeEventListener("drop", handleDragEnd);
    document.removeEventListener("drag", handleDrag);
    stopScrolling();
  };
}, []);





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
        ref={dragHandleRef}
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


