'use client';

import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/app/store/use-editor-store';
import { Editor } from '@tiptap/react';

interface TocItem {
  id: string;
  level: number;
  text: string;
}

export const TocOverlay = () => {
  const [items, setItems] = useState<TocItem[]>([]);
  const { editor } = useEditorStore();

  useEffect(() => {
    if (!editor) return;

    const updateToc = () => {
      const tocItems: TocItem[] = [];

      let headingCount = 0;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') {
          headingCount++;
          tocItems.push({
            id: node.attrs.id,
            level: node.attrs.level,
            text: node.textContent,
          });
        }
      });
      setItems(tocItems);
    };
    updateToc();

    // Set up event listener for future updates
    editor.on('update', updateToc);

    // Clean up function
    return () => {
      editor.off('update', updateToc);
    };
  }, [editor]);

  const scrollToHeading = (id: string, editor?: Editor | null) => {
    if (!editor) return;
    console.log('scroll');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      // Add Tailwind classes temporarily for highlight
      if (!element || !editor) return;

      // Find the node position by id
      const { doc } = editor.state;
      let nodePos = null;

      doc.descendants((node, pos) => {
        if (node.attrs.id === id) {
          nodePos = pos;
          return false; // stop iteration
        }
        return true;
      });

      if (nodePos !== null) {
        const node = doc.nodeAt(nodePos);
        if (node) {
          const from = nodePos;
          const to = nodePos + node.nodeSize;

          // Select the full node
          editor.commands.setTextSelection({ from, to });

          // Select the full node

          editor.commands.setTextSelection({ from, to });

          // Apply highlight (with fade effect)

          editor.commands.setMark('highlight');

          // Wait for 1 second (to allow fade-in) and then fade out the highlight

          setTimeout(() => {
            editor.commands.setTextSelection({ from, to });

            editor.commands.unsetMark('highlight');
          }, 1500);
        }
      }
    }
  };

  return (
    <div className="bg-white  rounded-lg shadow-md p-4">
      {items.length > 0 ? (
        <OverlayScrollbarsComponent
          options={{
            scrollbars: {
              autoHide: 'move',
              autoHideDelay: 500,
            },
          }}
          className="max-h-[300px] w-full"
        >
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-blue-600 transition-colors"
                style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                onClick={() => scrollToHeading(item.id, editor)}
              >
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </OverlayScrollbarsComponent>
      ) : (
        <p className="text-gray-500 italic text-sm">No headings found</p>
      )}
    </div>
  );
};
