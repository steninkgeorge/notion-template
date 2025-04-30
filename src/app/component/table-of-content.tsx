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

const threshold = 100;

export const TocOverlay = () => {
  const [items, setItems] = useState<TocItem[]>([]);
  const { editor } = useEditorStore();

  useEffect(() => {
    if (!editor) return;

    const updateToc = () => {
      const tocItems: TocItem[] = [];
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') {
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

    editor.on('update', updateToc);
    return () => {
      editor.off('update', updateToc);
    };
  }, [editor]);

  let highlightTimeoutId: NodeJS.Timeout | null = null;

  const scrollToHeading = (id: string, editor?: Editor | null) => {
    if (!editor) return;
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isWithinThreshold =
        rect.top >= threshold && rect.bottom <= viewportHeight - threshold;

      if (!isWithinThreshold) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const { doc } = editor.state;
      let nodePos = null;
      doc.descendants((node, pos) => {
        if (node.attrs.id === id) {
          nodePos = pos;
          return false;
        }
        return true;
      });

      if (nodePos !== null) {
        const node = doc.nodeAt(nodePos);
        if (node) {
          const from = nodePos;
          const to = nodePos + node.nodeSize;
          editor.commands.setTextSelection({ from, to });
          if (highlightTimeoutId) clearTimeout(highlightTimeoutId);
          editor.commands.setMark('highlight');
          highlightTimeoutId = setTimeout(() => {
            editor.commands.setTextSelection({ from, to });
            editor.commands.unsetMark('highlight');
            highlightTimeoutId = null;
          }, 1500);
        }
      }
    }
  };

  return (
    <>
      {items.length > 1 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-neutral-700 p-4 relative">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-neutral-800 to-transparent z-10 pointer-events-none" />
            <OverlayScrollbarsComponent
              options={{ scrollbars: { autoHide: 'scroll' } }}
              className="max-h-[300px] overflow-x-hidden"
            >
              <ul className="space-y-1">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-full overflow-hidden"
                    style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                    onClick={() => scrollToHeading(item.id, editor)}
                  >
                    <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap block truncate dark:text-neutral-200">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </OverlayScrollbarsComponent>
          </div>
        </div>
      )}
    </>
  );
};
