// import TiptapHeading from "@tiptap/extension-heading";
// import TipTapParagraph from '@tiptap/extension-paragraph';
// import { ReactNodeViewRenderer } from "@tiptap/react";
import { DraggableNode } from "../draggable-node";

import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react"; // If using React
import { Draggable } from "@/app/component/draggable";
// export const Paragraph = TipTapParagraph.extend({
//   draggable: true,

//   addNodeView() {
//     return ReactNodeViewRenderer(DraggableNode);
//   },
// });

// export default Paragraph;


// Custom paragraph extension that renders inside a div
const CustomParagraph = Node.create({
  name: "paragraph",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "draggableItem" }, ["p", HTMLAttributes, 0]];
  },
   
});

export default CustomParagraph;

