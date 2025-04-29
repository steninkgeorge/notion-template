import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';

import { CommandProps } from '@/types/command';
import React from 'react';

interface CommandMenuProps extends CommandProps {
  items: any[];
  command: (item: any) => void;
  clientRect: (() => DOMRect | null) | null | undefined;
}
export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (props, ref) => {
    const { items, command, clientRect } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const rect = clientRect?.() || new DOMRect();

    // Reset selection when items change
    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // Scroll selected item into view
    useEffect(() => {
      itemsRef.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }, [selectedIndex]);

    // Global keydown handler for navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!containerRef.current) return;

        // Only handle if menu is visible
        switch (e.key) {
          case 'ArrowDown':
            setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
            e.preventDefault();
            break;
          case 'ArrowUp':
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            e.preventDefault();
            break;
          case 'Enter':
            if (items[selectedIndex]) {
              command(items[selectedIndex]);
              // Stop the event completely
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            }
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [items, selectedIndex, command]);

    const viewportHeight = window.innerHeight;
    const menuHeight = Math.min(items.length * 48, 300); // Dynamic height
    const spaceBelow = viewportHeight - (rect.top + rect.height + menuHeight);
    const shouldShowAbove = spaceBelow < 0;

    const style = {
      position: 'absolute',
      top: shouldShowAbove
        ? `${rect.top - menuHeight}px`
        : `${rect.top + rect.height}px`,
      left: `${rect.left}px`,
      zIndex: 9999, // Ensure it's above everything
      width: '240px',
      maxHeight: `${menuHeight}px`,
      overflow: 'auto',
    } as CSSProperties;

    return (
      <div
        ref={mergeRefs(containerRef, ref)}
        style={style}
        className="bg-white border rounded-md shadow-lg outline-none"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault(); // Prevent editor blur
        }}
      >
        {items.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No results found</div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`p-2 text-sm cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => command(item)}
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          ))
        )}
      </div>
    );
  }
);

// Helper to merge refs
function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

CommandMenu.displayName = 'CommandMenu';
