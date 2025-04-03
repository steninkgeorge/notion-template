import TipTapBulletList from "@tiptap/extension-bullet-list";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DraggableNode } from "../draggable-node";

export const BulletList = TipTapBulletList.extend({
  draggable: true,
group: "block",
  addNodeView() {
    return ReactNodeViewRenderer(DraggableNode);
  },
  content: "listItem+",
});

export default BulletList;
