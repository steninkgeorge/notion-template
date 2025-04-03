import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";

// Define the schema types for better TypeScript support
type NodeType = {
  name: string;
  create: (attrs: Record<string, any>, content: any) => ProseMirrorNode;
};

type Schema = {
  nodes: {
    [key: string]: NodeType;
  };
};

export const WrapBlocksInDraggable = Extension.create({
  name: "wrapBlocksInDraggable",

  addProseMirrorPlugins() {
    // This plugin handles wrapping blocks in draggable items
    const wrapperPlugin = new Plugin({
      key: new PluginKey("wrapBlocksInDraggable"),

      // Run once when the editor is initialized
      view(view: EditorView) {
        // Wrap all current blocks
        const { state } = view;
        const { tr } = state;
        let modified = false;

        // Check if draggableItem exists in schema
        const schema = state.schema as Schema;
        if (!schema.nodes.draggableItem) {
          console.error("draggableItem node not found in schema");
          return {};
        }

        // Helper function to wrap nodes
        const wrapNode = (pos: number, node: ProseMirrorNode) => {
          const draggableItem = schema.nodes.draggableItem.create(
            {}, // no attrs
            [node.copy(node.content)] // copy the node with its content
          );
          tr.replaceWith(pos, pos + node.nodeSize, draggableItem);
          return true;
        };

        // Find standalone blocks to wrap
        state.doc.forEach((node: ProseMirrorNode, pos: number) => {
          if (
            ["paragraph", "heading", "bulletList", "orderedList"].includes(
              node.type.name
            ) &&
            state.doc.resolve(pos).parent.type.name === "doc"
          ) {
            modified = wrapNode(pos, node) || modified;
          }
        });

        if (modified) {
          view.dispatch(tr);
        }

        return {};
      },

      // Watch for future changes
      appendTransaction(transactions, oldState, newState) {
        // Skip if no changes
        if (!transactions.some((tr) => tr.docChanged)) return null;

        // Check if draggableItem exists in schema
        const schema = newState.schema as Schema;
        if (!schema.nodes.draggableItem) {
          return null;
        }

        const { tr } = newState;
        let modified = false;

        // Find standalone blocks to wrap
        newState.doc.forEach((node: ProseMirrorNode, pos: number) => {
          // Only wrap blocks that are direct children of the document and aren't already wrapped
          if (
            ["paragraph", "heading", "bulletList", "orderedList"].includes(
              node.type.name
            ) &&
            newState.doc.resolve(pos).parent.type.name === "doc"
          ) {
            // Create a draggableItem and wrap the node
            const draggableItem = schema.nodes.draggableItem.create(
              {}, // no attrs
              [node.copy(node.content)] // copy the node with its content
            );

            // Replace the node with wrapped version
            tr.replaceWith(pos, pos + node.nodeSize, draggableItem);
            modified = true;
          }
        });
        // This plugin handles Enter key in empty draggable blocks
       

        return modified ? tr : null;
      },
    });
    
     const enterKeyPlugin = keymap({
       Enter: (state, dispatch, view) => {
         const { selection } = state;
         const { $from } = selection;

         // Check if we're in a paragraph inside a draggableItem
         if (
           $from.parent.type.name === "paragraph" &&
           $from.node(-1)?.type.name === "draggableItem"
         ) {
           // Check if paragraph is empty AND is the only child of the draggableItem
           if (
             $from.parent.content.size === 0 &&
             $from.node(-1).childCount === 1
           ) {
             // Create a new empty paragraph in a new draggable item
             const schema = state.schema as Schema;
             const paragraph = schema.nodes.paragraph.create({}, []);
             const draggableItem = schema.nodes.draggableItem.create({}, [
               paragraph,
             ]);

             // Insert after current draggable
             const tr = state.tr.insert($from.after(-1), draggableItem);

             // Move selection to the new paragraph
             const newPos = $from.after(-1) + 2; // +2 to get inside the paragraph
             tr.setSelection(TextSelection.create(tr.doc, newPos));

             dispatch?.(tr);
             return true;
           }
         }

         // Let other handlers process this event
         return false;
       },
     });

    return [wrapperPlugin, enterKeyPlugin];
  },
});
