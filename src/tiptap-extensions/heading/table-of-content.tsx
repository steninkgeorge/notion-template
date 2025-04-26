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

// Define threshold (in pixels) from top and bottom of viewport
const threshold = 100;

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

  let highlightTimeoutId: NodeJS.Timeout | null = null;

  const scrollToHeading = (id: string, editor?: Editor | null) => {
    if (!editor) return;
    console.log('scroll');
    const element = document.getElementById(id);

    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const isWithinThreshold =
        rect.top >= threshold && rect.bottom <= viewportHeight - threshold;

      if (!isWithinThreshold) {
        console.log('not within');
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
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

          if (highlightTimeoutId) {
            clearTimeout(highlightTimeoutId);
          }

          // Apply highlight (with fade effect)

          editor.commands.setMark('highlight');

          // Wait for 1 second (to allow fade-in) and then fade out the highlight

          highlightTimeoutId = setTimeout(() => {
            editor.commands.setTextSelection({ from, to });

            editor.commands.unsetMark('highlight');
            highlightTimeoutId = null; // Clean up reference
          }, 1500);
        }
      }
    }
  };

  return (
    <>
      {items.length > 1 && (
        <div className="bg-white  rounded-lg shadow-md p-4 relative">
          <div className="relative">
            {/* Top fade overlay */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <OverlayScrollbarsComponent
              options={{
                scrollbars: {
                  autoHide: 'scroll',
                },
              }}
              className="max-h-[300px] overflow-x-hidden"
            >
              <ul className="space-y-1">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:text-blue-600 transition-colors max-w-full overflow-hidden"
                    style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                    onClick={() => scrollToHeading(item.id, editor)}
                  >
                    <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap block truncate">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </OverlayScrollbarsComponent>
            {/* Bottom fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      )}
    </>
  );
};
